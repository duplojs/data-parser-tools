import { type DP, E } from "@duplojs/utils";
import type * as TST from "@scripts/toTypescript";
import type { CallExpression, Identifier, ObjectLiteralExpression, PropertyAssignment } from "typescript";
import type { CheckerTransformerBuildErrorEither, CheckerTransformerCheckerNotSupportedEither } from "../checkerTransformer";

export type TransformerSuccessEither = E.Right<"buildSuccess", CallExpression | Identifier>;

export type DataParserNotSupportedEither = E.Left<"dataParserNotSupport", DP.DataParser>;

export type DataParserErrorEither = E.Left<"buildDataParserError", DP.DataParser>;

export type ToTypescriptDataParserNotSupportedEither = E.Left<"toTypescriptDataParserNotSupport", DP.DataParser>;

export type ToTypescriptDataParserErrorEither = E.Left<"toTypescriptBuildDataParserError", DP.DataParser>;

export type DataParserGetDefinitionErrorEither = E.Left<
	"buildDataParserGetDefinitionError",
	{
		dataParser: DP.DataParser;
		error: CheckerTransformerCheckerNotSupportedEither | CheckerTransformerBuildErrorEither;
	}
>;

export interface MapContextValue {
	readonly identifier: Identifier;
	readonly expression: CallExpression | Identifier;
	readonly typeIdentifier: Identifier | null;
}

export type MapContext = Map<DP.DataParsers, MapContextValue>;

export type MaybeTransformerEither =
	| TransformerSuccessEither
	| DataParserNotSupportedEither
	| DataParserErrorEither
	| DataParserGetDefinitionErrorEither
	| ToTypescriptDataParserNotSupportedEither
	| ToTypescriptDataParserErrorEither;

export interface TransformerParams {
	readonly dependencyIdentifier: Identifier;
	readonly context: MapContext;
	readonly importContext: TST.MapImportContext;

	/**
	 * @deprecated use importContext
	 */
	readonly importType: TST.MapImportContext;

	transformer(
		dataParser: DP.DataParser,
	): MaybeTransformerEither;

	success(
		result: CallExpression | Identifier,
	): TransformerSuccessEither;

	buildError(): DataParserErrorEither;
	addImport(path: string, typeName: string, type?: "default" | "namespace" | "direct"): void;
	getDefinition(
		customProperties?: readonly PropertyAssignment[],
	): readonly [ObjectLiteralExpression] | readonly [] | DataParserGetDefinitionErrorEither;
}

export type TransformerBuildFunction<
	GenericDataParser extends DP.DataParsers = DP.DataParsers,
> = (
	dataParser: GenericDataParser,
	params: TransformerParams,
) => MaybeTransformerEither;

export function createTransformer<
	GenericDataParser extends DP.DataParsers,
>(
	support: (dataParser: DP.DataParsers) => dataParser is GenericDataParser,
	builder: TransformerBuildFunction<GenericDataParser>,
) {
	return (
		dataParser: DP.DataParsers,
		params: TransformerParams,
	): MaybeTransformerEither => support(dataParser)
		? builder(
			dataParser,
			params,
		)
		: E.left("dataParserNotSupport", dataParser);
}
