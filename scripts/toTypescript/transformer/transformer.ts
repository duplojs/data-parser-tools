import { A, E, justReturn, unwrap, whenElse, type DP } from "@duplojs/utils";
import type { MapContext, DataParserNotSupportedEither, TransformerParams, createTransformer, TransformerMode, DataParserErrorEither, MapImportType, SupportedDataParsers } from "./create";
import { factory, SyntaxKind } from "typescript";
import type { TransformerHook } from "./hook";

export interface TransformerFunctionParams {
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context: MapContext;
	readonly mode: TransformerMode;
	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataParsers: SupportedDataParsers[];
	readonly importType: MapImportType;
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
				importType: params.importType,
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

	const currentIdentifier = whenElse(
		params.recursiveDataParsers,
		A.includes(currentSchema),
		() => {
			const identifier = currentSchema.definition.identifier ?? `RecursiveType${params.context.size}`;

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
		},
		justReturn(currentSchema.definition.identifier),
	);

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
		importType: params.importType,
		addImport(path, typeName) {
			const types = params.importType.get(path) ?? [];

			if (!A.includes(types, typeName)) {
				params.importType.set(path, A.push(types, typeName));
			}
		},
	};

	const result = A.reduce(
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
	);

	if (E.isLeft(result)) {
		return result;
	}

	if (currentIdentifier) {
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

