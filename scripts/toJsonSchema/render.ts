import { type DP, unwrap, E, kindHeritage, G, type Or, type IsEqual } from "@duplojs/utils";
import {
	type DataParserErrorEither,
	type DataParserNotSupportedEither,
	transformer,
	type MapContext,
	type TransformerMode,
	type TransformerHook,
	type createTransformer,
	type MapperSupportedVersions,
	type JsonSchema,
	supportedVersions,
	buildRef,
	type SupportedVersions,
} from "./transformer";
import { createToJsonSchemaKind } from "./kind";
import { getRecursiveDataParser } from "@scripts/utils";

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

export interface RenderParams<
	GenericVersion extends SupportedVersions,
> {
	readonly identifier: string;
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context?: MapContext;
	readonly mode?: TransformerMode;
	readonly hooks?: readonly TransformerHook[];
	readonly version: GenericVersion;
}

type RenderResult<
	GenericVersion extends SupportedVersions,
> = Or<[
	IsEqual<GenericVersion, "openApi3">,
	IsEqual<GenericVersion, "openApi31">,
]> extends true
	? {
		$ref: `#/components/schemas/${string}`;
		openapi: MapperSupportedVersions[GenericVersion];
		components: {
			schemas: Record<string, JsonSchema>;
		};
	}
	: Or<[
		IsEqual<GenericVersion, "jsonSchema7">,
		IsEqual<GenericVersion, "jsonSchema4">,
	]> extends true
		? {
			$ref: `#/$defs/${string}`;
			$schema: MapperSupportedVersions[GenericVersion];
			definitions: Record<string, JsonSchema>;
		}
		: IsEqual<GenericVersion, "jsonSchema202012"> extends true
			? {
				$ref: `#/definitions/${string}`;
				$schema: MapperSupportedVersions[GenericVersion];
				$defs: Record<string, JsonSchema>;
			}
			: never;

export function render<
	GenericVersion extends SupportedVersions,
>(
	schema: DP.DataParsers,
	params: RenderParams<GenericVersion>,
): RenderResult<GenericVersion> {
	const context: MapContext = new Map(params.context);

	const result = transformer(
		schema,
		{
			...params,
			context,
			mode: params.mode ?? "out",
			hooks: params.hooks ?? [],
			version: params.version,
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
		G.reduceFrom<Record<string, JsonSchema>>({}),
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

	if (
		params.version === "openApi3"
		|| params.version === "openApi31"
	) {
		return {
			$ref: buildRef(params.identifier, params.version),
			openapi: supportedVersions[params.version],
			components: {
				schemas: definitionsWithIdentifier,
			},
		} as never;
	}

	if (params.version === "jsonSchema202012") {
		return {
			$ref: buildRef(params.identifier, params.version),
			$schema: params.version,
			$defs: definitionsWithIdentifier,
		} as never;
	}

	return {
		$ref: buildRef(params.identifier, params.version),
		$schema: supportedVersions[params.version],
		definitions: definitionsWithIdentifier,
	} as never;
}
