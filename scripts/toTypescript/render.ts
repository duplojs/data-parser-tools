import { type DP, E, kindHeritage } from "@duplojs/utils";
import { type MapContext, type MapImportContext, type DataParserErrorEither, type DataParserNotSupportedEither } from "./transformer";
import { createToTypescriptKind } from "./kind";
import { buildContext, type BuildContextParams } from "./buildContext";
import { printer } from "./printer";

export interface RenderParams extends BuildContextParams {

	/**
	 * @deprecated use importContext
	 */
	readonly importType: MapImportContext;
}

export class DataParserToTypescriptRenderError extends kindHeritage(
	"data-parser-to-typescript-render-error",
	createToTypescriptKind("data-parser-to-typescript-render-error"),
	Error,
) {
	public constructor(
		public schema: DP.DataParser,
		public error: DataParserNotSupportedEither | DataParserErrorEither,
	) {
		super({}, ["Error during the render of dataParser in typescript type."]);
	}
}

export function render(schema: DP.DataParser, params: RenderParams) {
	const context: MapContext = new Map(params.context);
	const importContext: MapImportContext = new Map(params.importContext ?? params.importType);

	const result = buildContext(schema, {
		...params,
		context,
		importContext,
	});

	if (E.isLeft(result)) {
		throw new DataParserToTypescriptRenderError(
			schema,
			result,
		);
	}

	return printer(
		result,
	);
}
