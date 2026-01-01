import { type DP, unwrap, E, kindHeritage, equal, or, G } from "@duplojs/utils";
import {
	type DataParserErrorEither,
	type DataParserNotSupportedEither,
	transformer,
	type MapContext,
	type TransformerMode,
	type TransformerHook,
	type createTransformer,
	supportedVersions,
	type SupportedVersionsUrl,
	type SupportedVersions,
} from "./transformer";
import { createToJsonSchemaKind } from "./kind";
import { getRecursiveDataParser } from "@scripts/utils/getRecursiveDataParser";

export interface RenderParams {
	readonly identifier: string;
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context?: MapContext;
	readonly mode?: TransformerMode;
	readonly hooks?: readonly TransformerHook[];
	readonly version: SupportedVersions;
}

export class DataParserToJsonSchemaRenderError extends kindHeritage(
	"data-parser-to-json-schema-render-error",
	createToJsonSchemaKind("data-parser-to-json-schema-render-error"),
	Error,
) {
	public constructor(
		public schema: DP.DataParsers,
		public error: DataParserNotSupportedEither | DataParserErrorEither,
	) {
		super({}, ["Error during the render of dataParser in jsonSchema."]);
	}
}

function buildRef(
	name: string,
	version: SupportedVersionsUrl,
) {
	if (version === supportedVersions.openApi3 || version === supportedVersions.openApi31) {
		return { $ref: `#/components/schemas/${name}` };
	}

	if (version === supportedVersions.jsonSchema202012) {
		return { $ref: `#/$defs/${name}` };
	}

	return { $ref: `#/definitions/${name}` };
}

function getDefinitionKey(version: SupportedVersionsUrl) {
	if (version === supportedVersions.jsonSchema202012 || version === supportedVersions.openApi31) {
		return "$defs";
	}

	return "definitions";
}

export function render(schema: DP.DataParsers, params: RenderParams) {
	const context: MapContext = new Map(params.context);
	const version = supportedVersions[params.version];

	const result = transformer(
		schema,
		{
			...params,
			context,
			mode: params.mode ?? "out",
			hooks: params.hooks ?? [],
			version,
			recursiveDataParsers: getRecursiveDataParser(schema),
		},
	);

	if (E.isLeft(result)) {
		throw new DataParserToJsonSchemaRenderError(
			schema,
			result,
		);
	}

	const built = unwrap(result);

	const definitions = G.reduce(
		context.values(),
		G.reduceFrom<Record<string, unknown>>({}),
		({ element, lastValue, next }) => element.schema
			? next({
				...lastValue,
				[element.name]: element.schema,
			})
			: next(lastValue),
	);

	const definitionsWithIdentifier = definitions[params.identifier]
		? definitions
		: {
			...definitions,
			[params.identifier]: built.schema,
		};

	if (or(
		version,
		[
			equal(supportedVersions.openApi3),
			equal(supportedVersions.openApi31),
		],
	)) {
		return JSON.stringify(
			{
				openapi: version,
				components: {
					schemas: definitionsWithIdentifier,
				},
				...buildRef(params.identifier, version),
			},
			null,
			4,
		);
	}

	const definitionKey = getDefinitionKey(version);

	return {
		$schema: version,
		...buildRef(params.identifier, version),
		[definitionKey]: definitionsWithIdentifier,
	};
}
