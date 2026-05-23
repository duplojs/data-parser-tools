import { DP, E, unwrap } from "@duplojs/utils";
import { type createTransformer, transformer, type MapContext, type MapImportContext, type MapImportType, type TransformerHook, type TransformerMode, type DataParserErrorEither, type DataParserNotSupportedEither, createImportContext } from "./transformer";
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

	/**
	 * @deprecated use importContext
	 */
	readonly importType?: MapImportType;
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
	const importContext: MapImportContext = createImportContext(
		params.importContext,
		params.importType,
	);

	const result = transformer(
		schema,
		{
			...params,
			context,
			importContext,
			importType: importContext,
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
				factory.createIdentifier(params.identifier),
				undefined,
				unwrap(result),
			),
		);
	} else if (schema.definition.identifier !== params.identifier) {
		context.set(
			DP.empty(),
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(params.identifier),
				undefined,
				factory.createTypeReferenceNode(
					schema.definition.identifier,
				),
			),
		);
	}

	return {
		context,
		importContext,
	};
}
