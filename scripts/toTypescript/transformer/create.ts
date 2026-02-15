import { type TypeAliasDeclaration, type TypeNode } from "typescript";
import { type DP, E } from "@duplojs/utils";
import { type SDP } from "@duplojs/server-utils";

export type TransformerSuccessEither<
> = E.Right<"buildSuccess", TypeNode>;

export type DataParserNotSupportedEither<
> = E.Left<"dataParserNotSupport", DP.DataParser>;

export type DataParserErrorEither<
> = E.Left<"buildDataParserError", DP.DataParser>;

export type SupportedDataParsers = DP.DataParsers | SDP.DataParserFile;

export type MapContext = Map<SupportedDataParsers, TypeAliasDeclaration>;

export type MapImportType = Map<string, string[]>;

export type MaybeTransformerEither =
	| TransformerSuccessEither
	| DataParserNotSupportedEither
	| DataParserErrorEither;

export type TransformerMode = "in" | "out";

export interface TransformerParams {
	readonly mode: TransformerMode;
	readonly context: MapContext;
	readonly importType: MapImportType;

	transformer(
		schema: DP.DataParser,
	): MaybeTransformerEither;

	success(
		result: TypeNode,
	): TransformerSuccessEither;

	buildError(): DataParserErrorEither;
	addImport(path: string, typeName: string): void;
}

export function createTransformer<
	GenericDataParser extends SupportedDataParsers,
>(
	support: (schema: SupportedDataParsers) => schema is GenericDataParser,
	builder: (
		schema: GenericDataParser,
		params: TransformerParams,
	) => MaybeTransformerEither,
) {
	return (
		schema: SupportedDataParsers,
		params: TransformerParams,
	): MaybeTransformerEither => support(schema)
		? builder(
			schema,
			params,
		)
		: E.left("dataParserNotSupport", schema);
}
