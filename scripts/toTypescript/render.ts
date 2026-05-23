import { type DP, E, kindClass } from "@duplojs/utils";
import { type MapContext, type MapImportContext, type MapImportType, type DataParserErrorEither, type DataParserNotSupportedEither, createImportContext } from "./transformer";
import { createToTypescriptKind } from "./kind";
import { buildContext, type BuildContextParams } from "./buildContext";
import { printer } from "./printer";

export interface RenderParams extends BuildContextParams {

	/**
	 * @deprecated use importContext
	 */
	readonly importType?: MapImportType;
}

export class DataParserToTypescriptRenderError extends kindClass(
	createToTypescriptKind("data-parser-to-typescript-render-error"),
	Error,
) {
	public constructor(
		public schema: DP.DataParser,
		public error: DataParserNotSupportedEither | DataParserErrorEither,
	) {
		super({}, "Error during the render of dataParser in typescript type.");
	}
}

export function render(schema: DP.DataParser, params: RenderParams) {
	const context: MapContext = new Map(params.context);
	const importContext: MapImportContext = createImportContext(
		params.importContext,
		params.importType,
	);

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
