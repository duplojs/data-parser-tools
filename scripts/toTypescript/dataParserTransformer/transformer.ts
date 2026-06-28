import { A, type DDataParser, E, unwrap, type DP, justExec, pipe, when, type AnyTuple } from "@duplojs/utils";
import type { MapContext, DataParserNotSupportedEither, TransformerParams, createTransformer, TransformerMode, DataParserErrorEither, MapImportContext, TransformerSuccessEither } from "./create";
import { factory, SyntaxKind, type TypeNode } from "typescript";
import type { TransformerHook } from "./hook";
import { createAddImport } from "./addImport";
import { createIdentifier } from "./createIdentifier";
import { checkerRefiner, type CheckerTransformerFunctionParams, type createCheckerRefiner } from "../checkerRefiner";

export interface TransformerFunctionParams {
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly checkerRefiner?: readonly ReturnType<typeof createCheckerRefiner>[];
	readonly context: MapContext;
	readonly mode: TransformerMode;
	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataParsers: DDataParser.DataParser[];
	readonly importContext: MapImportContext;
}

export function transformer(
	schema: DP.DataParser,
	params: TransformerFunctionParams,
) {
	const currentSchema = A.reduce(
		params.hooks,
		A.reduceFrom<DP.DataParser>(schema),
		({ element: hook, lastValue, next, exit }) => {
			const result = hook({
				schema: lastValue,
				context: params.context,
				importContext: params.importContext,
				output: (action, schema) => ({
					schema,
					action,
				}),
			});

			if (result.action === "stop") {
				return exit(result.schema);
			} else {
				return next(result.schema);
			}
		},
	);

	const currentDeclaration = params.context.get(currentSchema);

	if (currentDeclaration) {
		return E.right(
			"buildSuccess",
			factory.createTypeReferenceNode(
				currentDeclaration.name,
			),
		);
	}

	const currentIdentifier = justExec(() => {
		if (
			!A.includes(params.recursiveDataParsers, currentSchema)
			&& !currentSchema.definition.identifier
		) {
			return undefined;
		}

		const identifier = currentSchema.definition.identifier !== undefined
			? createIdentifier(currentSchema.definition.identifier)
			: `RecursiveType${params.context.size}`;

		params.context.set(
			currentSchema,
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(identifier),
				undefined,
				factory.createTypeReferenceNode(
					identifier,
				),
			),
		);

		return identifier;
	});

	const functionParams: TransformerParams = {
		success(result) {
			return E.right("buildSuccess", result);
		},
		transformer(schema) {
			return transformer(
				schema,
				params,
			);
		},
		context: params.context,
		mode: params.mode,
		buildError() {
			return E.left("buildDataParserError");
		},
		importContext: params.importContext,
		addImport: createAddImport(params.importContext),
	};

	const result = pipe(
		currentSchema.definition.overrideTypescriptTransformer
			? currentSchema.definition.overrideTypescriptTransformer(
				currentSchema.addOverrideTypescriptTransformer(null),
				functionParams,
			)
			: A.reduce(
				params.transformers,
				A.reduceFrom<DataParserNotSupportedEither | DataParserErrorEither>(
					E.left("dataParserNotSupport", currentSchema),
				),
				({
					element: functionBuilder,
					lastValue,
					next,
					exit,
				}) => {
					const result = functionBuilder(currentSchema, functionParams);

					if (E.isLeft(result)) {
						if (unwrap(result) !== currentSchema) {
							return exit(result);
						}

						return next(lastValue);
					}

					return exit(result);
				},
			),
		when(
			E.hasInformation("buildSuccess"),
			(resultTypeNode): TransformerSuccessEither => {
				if (
					!A.minElements(currentSchema.definition.checkers, 1)
					|| !params.checkerRefiner
					|| !A.minElements(params.checkerRefiner, 1)
				) {
					return resultTypeNode;
				}

				const currentTypeNode = unwrap(resultTypeNode);

				const refinerFunctionParams: CheckerTransformerFunctionParams = {
					mode: functionParams.mode,
					importContext: functionParams.importContext,
					refiners: params.checkerRefiner,
				};

				return pipe(
					currentSchema.definition.checkers,
					A.reduce(
						A.reduceFrom<AnyTuple<TypeNode>>([currentTypeNode]),
						({ element: checker, next, lastValue }) => pipe(
							checkerRefiner(
								checker,
								currentTypeNode,
								refinerFunctionParams,
							),
							E.whenHasInformationOtherwise(
								"buildSuccess",
								(refinedTypeNode) => next([...lastValue, refinedTypeNode]),
								() => next(lastValue),
							),
						),
					),
					(result) => {
						if (A.minElements(result, 2)) {
							return E.right(
								"buildSuccess",
								factory.createIntersectionTypeNode(result),
							);
						}

						return resultTypeNode;
					},
				);
			},
		),
	);

	if (E.isLeft(result)) {
		return result;
	}

	if (currentIdentifier) {
		params.context.delete(currentSchema);

		params.context.set(
			currentSchema,
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(currentIdentifier),
				undefined,
				unwrap(result),
			),
		);

		return E.right(
			"buildSuccess",
			factory.createTypeReferenceNode(
				currentIdentifier,
			),
		);
	}

	return result;
}
