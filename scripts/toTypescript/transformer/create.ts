import { type TypeAliasDeclaration, type TypeNode } from "typescript";
import { type DP, E } from "@duplojs/utils";

export type TransformerSuccessEither<
> = E.Right<"buildSuccess", TypeNode>;

export type DataParserNotSupportedEither<
> = E.Left<"dataParserNotSupport", DP.DataParser>;

export type DataParserErrorEither<
> = E.Left<"buildDataParserError", DP.DataParser>;

export type MapContext = Map<DP.DataParsers, TypeAliasDeclaration>;

export type MapImportContext = Map<
	string,
	{
		namespace?: string[];
		default?: string[];
		direct?: string[];
	}
>;

export type MaybeTransformerEither =
	| TransformerSuccessEither
	| DataParserNotSupportedEither
	| DataParserErrorEither;

export type TransformerMode = "in" | "out";

export interface TransformerParams {
	readonly mode: TransformerMode;
	readonly context: MapContext;
	readonly importContext: MapImportContext;

	/**
	 * @deprecated use importContext
	 */
	readonly importType: MapImportContext;

	transformer(
		schema: DP.DataParser,
	): MaybeTransformerEither;

	success(
		result: TypeNode,
	): TransformerSuccessEither;

	buildError(): DataParserErrorEither;
	addImport(path: string, typeName: string, type?: "default" | "namespace" | "direct"): void;
}

export type TransformerBuildFunction<
	GenericDataParser extends DP.DataParsers = DP.DataParsers,
> = (
	schema: GenericDataParser,
	params: TransformerParams,
) => MaybeTransformerEither;

export function createTransformer<
	GenericDataParser extends DP.DataParsers,
>(
	support: (schema: DP.DataParsers) => schema is GenericDataParser,
	builder: TransformerBuildFunction<GenericDataParser>,
) {
	return (
		schema: DP.DataParsers,
		params: TransformerParams,
	): MaybeTransformerEither => support(schema)
		? builder(
			schema,
			params,
		)
		: E.left("dataParserNotSupport", schema);
}
