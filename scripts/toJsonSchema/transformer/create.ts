import { type DP, E } from "@duplojs/utils";
import type {
	JsonSchemaArray,
	JsonSchemaBigInt,
	JsonSchemaBoolean,
	JsonSchemaDate,
	JsonSchemaEmpty,
	JsonSchemaLiteral,
	JsonSchemaNil,
	JsonSchemaNullableAnyOf,
	JsonSchemaNumber,
	JsonSchemaObject,
	JsonSchemaRecord,
	JsonSchemaString,
	JsonSchemaTemplateLiteral,
	JsonSchemaTuple,
	JsonSchemaUnion,
	JsonSchemaUnknown,
	JsonSchemaTime,
} from "./defaults";

export interface JsonSchemaRef {
	$ref: string;
}

export interface JsonSchemaAnyOf {
	anyOf: JsonSchema[];
}

export type JsonSchema =
	| JsonSchemaRef
	| JsonSchemaAnyOf
	| JsonSchemaArray
	| JsonSchemaBigInt
	| JsonSchemaBoolean
	| JsonSchemaDate
	| JsonSchemaEmpty
	| JsonSchemaLiteral
	| JsonSchemaNil
	| JsonSchemaNullableAnyOf
	| JsonSchemaNumber
	| JsonSchemaObject
	| JsonSchemaRecord
	| JsonSchemaString
	| JsonSchemaTemplateLiteral
	| JsonSchemaTuple
	| JsonSchemaUnion
	| JsonSchemaUnknown
	| JsonSchemaTime;

export interface TransformerSuccess {
	readonly schema: JsonSchema;
	readonly isOptional: boolean;
}

export type TransformerSuccessEither =
	E.EitherRight<"buildSuccess", TransformerSuccess>;

export type DataParserNotSupportedEither =
	E.EitherLeft<"dataParserNotSupport", DP.DataParser>;

export type DataParserErrorEither =
	E.EitherLeft<"buildDataParserError", DP.DataParser>;

export interface MapContextValue {
	readonly name: string;
	readonly schema?: JsonSchema;
	readonly isOptional: boolean;
}

export type MapContext = Map<DP.DataParsers, MapContextValue>;

export type MaybeTransformerEither =
	| TransformerSuccessEither
	| DataParserNotSupportedEither
	| DataParserErrorEither;

export type TransformerMode = "in" | "out";

export const supportedVersions = {
	jsonSchema4: "http://json-schema.org/draft-04/schema#",
	jsonSchema7: "http://json-schema.org/draft-07/schema#",
	jsonSchema202012: "https://json-schema.org/draft/2020-12/schema",
	openApi3: "https://spec.openapis.org/oas/3.0.3",
	openApi31: "https://spec.openapis.org/oas/3.1.0",
} as const;

export type SupportedVersions = typeof supportedVersions;
export type SupportedVersionsUrl = typeof supportedVersions[keyof SupportedVersions];

export interface TransformerParams {
	readonly mode: TransformerMode;
	readonly context: MapContext;
	readonly version: SupportedVersionsUrl;

	transformer(
		schema: DP.DataParser,
	): MaybeTransformerEither;

	success(
		result: JsonSchema,
		isOptional?: boolean,
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
