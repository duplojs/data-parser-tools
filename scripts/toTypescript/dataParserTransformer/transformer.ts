import { A, type DDataParser, E, unwrap, type DP, justExec, pipe, when, type AnyTuple, whenElse } from "@duplojs/utils";
import type { MapContext, DataParserNotSupportedEither, TransformerParams, createTransformer, TransformerMode, DataParserErrorEither, MapImportContext, TransformerSuccessEither } from "./create";
import { factory, SyntaxKind, type TypeNode } from "typescript";
import type { TransformerHook } from "./hook";
import { createAddImport } from "./addImport";
import { createIdentifier } from "./createIdentifier";
import { checkerRefiner, type CheckerRefinerBuildErrorEither, type CheckerTransformerFunctionParams, type createCheckerRefiner } from "../checkerRefiner";
import { applyMapImportContextEntries } from "../override";

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
	dataParser: DP.DataParser,
	params: TransformerFunctionParams,
) {
	const currentDataParser = A.reduce(
		params.hooks,
		A.reduceFrom<DP.DataParser>(dataParser),
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

	const currentDeclaration = params.context.get(currentDataParser);

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
			!A.includes(params.recursiveDataParsers, currentDataParser)
			&& !currentDataParser.definition.identifier
		) {
			return undefined;
		}

		const identifier = currentDataParser.definition.identifier !== undefined
			? createIdentifier(currentDataParser.definition.identifier)
			: `RecursiveType${params.context.size}`;

		params.context.set(
			currentDataParser,
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

	if (currentDataParser.definition.mapImportContextEntries) {
		applyMapImportContextEntries(
			functionParams.addImport,
			currentDataParser.definition.mapImportContextEntries,
		);
	}

	const result = pipe(
		currentDataParser.definition.overrideTypescriptTransformer
			? currentDataParser.definition.overrideTypescriptTransformer(
				currentDataParser.addOverrideTypescriptTransformer(null),
				functionParams,
			)
			: A.reduce(
				params.transformers,
				A.reduceFrom<DataParserNotSupportedEither | DataParserErrorEither>(
					E.left("dataParserNotSupport", currentDataParser),
				),
				({
					element: functionBuilder,
					lastValue,
					next,
					exit,
				}) => {
					const result = functionBuilder(currentDataParser, functionParams);

					if (E.isLeft(result)) {
						if (E.hasInformation(result, ["buildCheckerError", "buildDataParserError"])) {
							return exit(result);
						}

						return next(lastValue);
					}

					return exit(result);
				},
			),
		when(
			E.hasInformation("buildSuccess"),
			(resultTypeNode): TransformerSuccessEither | CheckerRefinerBuildErrorEither => {
				if (
					!A.minElements(currentDataParser.definition.checkers, 1)
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
					currentDataParser.definition.checkers,
					A.reduce(
						A.reduceFrom<AnyTuple<TypeNode>>([currentTypeNode]),
						({ element: checker, next, exit, lastValue }) => pipe(
							checkerRefiner(
								checker,
								currentTypeNode,
								refinerFunctionParams,
							),
							E.whenHasInformationOtherwise(
								"buildSuccess",
								(refinedTypeNode) => next([...lastValue, refinedTypeNode]),
								whenElse(
									E.hasInformation(["buildCheckerError"]),
									exit,
									() => next(lastValue),
								),
							),
						),
					),
					(result) => {
						if (E.hasInformation(result, "buildCheckerError")) {
							return result;
						}

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
		params.context.delete(currentDataParser);

		params.context.set(
			currentDataParser,
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
