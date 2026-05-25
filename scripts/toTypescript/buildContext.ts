import { DP, E, unwrap } from "@duplojs/utils";
import { createIdentifier, type createTransformer, transformer, type MapContext, type MapImportContext, type TransformerHook, type TransformerMode, type DataParserErrorEither, type DataParserNotSupportedEither } from "./transformer";
import { getRecursiveDataParser } from "@scripts/utils";
import { factory, SyntaxKind } from "typescript";

export interface BuildedContext {
	readonly context: MapContext;
	readonly importContext: MapImportContext;
}

export interface BuildContextParams {
	readonly identifier: string;
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context?: MapContext;
	readonly mode?: TransformerMode;
	readonly hooks?: readonly TransformerHook[];
	readonly importContext?: MapImportContext;
}

export function buildContext(
	schema: DP.DataParser,
	params: BuildContextParams,
): (
	| BuildedContext
	| DataParserNotSupportedEither
	| DataParserErrorEither
	) {
	const context: MapContext = params.context ?? new Map();
	const importContext: MapImportContext = params.importContext ?? new Map();

	const result = transformer(
		schema,
		{
			...params,
			context,
			importContext,
			mode: params.mode ?? "out",
			hooks: params.hooks ?? [],
			recursiveDataParsers: getRecursiveDataParser(schema),
		},
	);

	if (E.isLeft(result)) {
		return result;
	}

	if (!schema.definition.identifier) {
		context.set(
			DP.empty(),
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(createIdentifier(params.identifier)),
				undefined,
				unwrap(result),
			),
		);
	} else if (schema.definition.identifier !== params.identifier) {
		context.set(
			DP.empty(),
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(createIdentifier(params.identifier)),
				undefined,
				factory.createTypeReferenceNode(
					createIdentifier(schema.definition.identifier),
				),
			),
		);
	}

	return {
		context,
		importContext,
	};
}
