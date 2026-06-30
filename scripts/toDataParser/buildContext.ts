import { DP, E, unwrap } from "@duplojs/utils";
import { createIdentifier, type createTransformer, transformer, type MapContext, type TransformerHook, type DataParserErrorEither, type DataParserNotSupportedEither, type DataParserGetDefinitionErrorEither, type ToTypescriptDataParserErrorEither, type ToTypescriptDataParserNotSupportedEither, type DependenciesContext, type ToTypescriptCheckerErrorEither } from "./dataParserTransformer";
import type * as TST from "@scripts/toTypescript";
import { getRecursiveDataParser } from "@scripts/utils";
import { factory } from "typescript";
import { type createCheckerTransformer } from "./checkerTransformer";

export type ImportMode = "lite" | "extended";

export interface BuildedContext {
	readonly context: MapContext;
	readonly typescriptContext: TST.MapContext;
	readonly importContext: TST.MapImportContext;
	readonly importMode: ImportMode;
}

export interface BuildContextParams {
	readonly identifier: string;
	readonly dataParserTransformers: readonly ReturnType<typeof createTransformer>[];
	readonly checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly typescriptTransformers: readonly ReturnType<typeof TST.createTransformer>[];
	readonly typescriptCheckerRefiner?: readonly ReturnType<typeof TST.createCheckerRefiner>[];
	readonly context?: MapContext;
	readonly typescriptContext?: TST.MapContext;
	readonly importContext?: TST.MapImportContext;
	readonly importMode?: ImportMode;
	readonly hooks?: readonly TransformerHook[];
	readonly toTypescript?: {
		readonly mode?: TST.TransformerMode;
		readonly hooks?: readonly TST.TransformerHook[];
	};
}

export function buildContext(
	schema: DP.DataParser,
	params: BuildContextParams,
): (
	| E.Success<BuildedContext>
	| DataParserNotSupportedEither
	| DataParserErrorEither
	| DataParserGetDefinitionErrorEither
	| ToTypescriptDataParserNotSupportedEither
	| ToTypescriptDataParserErrorEither
	| ToTypescriptCheckerErrorEither
	) {
	const context: MapContext = params.context ?? new Map();
	const typescriptContext: TST.MapContext = params.typescriptContext ?? new Map();
	const importContext: TST.MapImportContext = params.importContext ?? new Map();
	const dependenciesContext: DependenciesContext = new Set();
	const importMode = params.importMode ?? "lite";

	importContext.set("@duplojs/utils/dataParser", {
		namespace: ["DP"],
	});

	if (importMode === "extended") {
		importContext.set("@duplojs/utils/dataParserExtended", {
			namespace: ["DPE"],
		});
	}

	const result = transformer(
		schema,
		{
			...params,
			context,
			typescriptContext,
			importContext: importContext,
			hooks: params.hooks ?? [],
			recursiveDataParsers: getRecursiveDataParser(schema),
			dependencyIdentifier: factory.createIdentifier(importMode === "extended" ? "DPE" : "DP"),
			dependenciesContext,
		},
	);

	if (E.isLeft(result)) {
		return result;
	}

	if (!schema.definition.identifier) {
		context.set(
			DP.empty(),
			{
				identifier: factory.createIdentifier(createIdentifier(params.identifier)),
				expression: unwrap(result),
				typeIdentifier: null,
				dependencies: dependenciesContext,
			},
		);
	} else if (schema.definition.identifier !== params.identifier) {
		dependenciesContext.add(schema);

		context.set(
			DP.empty(),
			{
				identifier: factory.createIdentifier(createIdentifier(params.identifier)),
				expression: factory.createIdentifier(createIdentifier(schema.definition.identifier)),
				typeIdentifier: null,
				dependencies: dependenciesContext,
			},
		);
	}

	return E.success({
		context,
		importContext: importContext,
		typescriptContext,
		importMode,
	});
}
