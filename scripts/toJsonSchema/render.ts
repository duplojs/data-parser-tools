import { type DP, unwrap, E, kindHeritage, G, type Or, type IsEqual } from "@duplojs/utils";
import {
	type DataParserErrorEither,
	type DataParserNotSupportedEither,
	transformer,
	type MapContext,
	type TransformerMode,
	type TransformerHook,
	type createTransformer,
	type SupportedVersions,
	type JsonSchema,
	supportedVersions,
	buildRef,
} from "./transformer";
import { createToJsonSchemaKind } from "./kind";
import { getRecursiveDataParser } from "@scripts/utils/getRecursiveDataParser";

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
	GenericVersion extends unknown,
> {
	readonly identifier: string;
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context?: MapContext;
	readonly mode?: TransformerMode;
	readonly hooks?: readonly TransformerHook[];
	readonly version: GenericVersion;
}

type RenderResult<
	GenericVersion extends keyof SupportedVersions,
> = Or<[
	IsEqual<GenericVersion, "openApi3">,
	IsEqual<GenericVersion, "openApi31">,
]> extends true
	? {
		$ref: `#/components/schemas/${string}`;
		openapi: SupportedVersions[GenericVersion];
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
			$schema: SupportedVersions[GenericVersion];
			definitions: Record<string, JsonSchema>;
		}
		: IsEqual<GenericVersion, "jsonSchema202012"> extends true
			? {
				$ref: `#/definitions/${string}`;
				$schema: SupportedVersions[GenericVersion];
				$defs: Record<string, JsonSchema>;
			}
			: never;

export function render<
	GenericVersion extends keyof SupportedVersions,
>(
	schema: DP.DataParsers,
	params: RenderParams<GenericVersion>,
): RenderResult<GenericVersion> {
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
		version === supportedVersions.openApi3
		|| version === supportedVersions.openApi31
	) {
		return {
			$ref: buildRef(params.identifier, version),
			openapi: version,
			components: {
				schemas: definitionsWithIdentifier,
			},
		} as never;
	}

	if (version === supportedVersions.jsonSchema202012) {
		return {
			$ref: buildRef(params.identifier, version),
			$schema: version,
			$defs: definitionsWithIdentifier,
		} as never;
	}

	return {
		$ref: buildRef(params.identifier, version),
		$schema: version,
		definitions: definitionsWithIdentifier,
	} as never;
}
