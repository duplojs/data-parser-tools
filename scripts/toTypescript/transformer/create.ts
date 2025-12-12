import { type TypeAliasDeclaration, type TypeNode } from "typescript";
import { type DP, E } from "@duplojs/utils";

export type TransformerSuccessEither<
> = E.EitherRight<"buildSuccess", TypeNode>;

export type DataParserNotSupportedEither<
> = E.EitherLeft<"dataParserNotSupport", DP.DataParser>;

export type DataParserErrorEither<
> = E.EitherLeft<"buildDataParserError", DP.DataParser>;

export type MapContext = Map<DP.DataParsers, TypeAliasDeclaration>;

export type MaybeTransformerEither =
	| TransformerSuccessEither
	| DataParserNotSupportedEither
	| DataParserErrorEither;

export type TransformerMode = "in" | "out";

export interface TransformerParams {
	readonly mode: TransformerMode;
	readonly context: MapContext;

	transformer(
		schema: DP.DataParser,
	): MaybeTransformerEither;

	success(
		result: TypeNode,
	): TransformerSuccessEither;

	buildError(): DataParserErrorEither;
}

export function createTransformer<
	GenericDataParser extends DP.DataParsers,
>(
	support: (schema: DP.DataParsers) => schema is GenericDataParser,
	builder: (
		schema: GenericDataParser,
		params: TransformerParams,
	) => MaybeTransformerEither,
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
