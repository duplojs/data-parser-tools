import { type DP, E, kindClass, unwrap } from "@duplojs/utils";
import { type DataParserErrorEither, type DataParserNotSupportedEither } from "./dataParserTransformer";
import { createToTypescriptKind } from "./kind";
import { buildContext, type BuildContextParams } from "./buildContext";
import { printer } from "./printer";
import { type CheckerRefinerBuildErrorEither } from "./checkerRefiner";

export interface RenderParams extends BuildContextParams {

}

export class DataParserToTypescriptRenderError extends kindClass(
	createToTypescriptKind("data-parser-to-typescript-render-error"),
	Error,
) {
	public constructor(
		public schema: DP.DataParser,
		public error: DataParserNotSupportedEither | DataParserErrorEither | CheckerRefinerBuildErrorEither,
	) {
		super({}, "Error during the render of dataParser in typescript type.");
	}
}

export function render(schema: DP.DataParser, params: RenderParams) {
	const context = new Map(params.context);
	const importContext = new Map(params.importContext);

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
		unwrap(result),
	);
}
