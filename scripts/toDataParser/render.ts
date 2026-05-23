import * as TST from "@scripts/toTypescript";
import { type DataParserNotSupportedEither, type DataParserGetDefinitionErrorEither, type DataParserErrorEither, type MapContext, type ToTypescriptDataParserErrorEither, type ToTypescriptDataParserNotSupportedEither } from "./dataParserTransformer";
import { createToDataParserKind } from "./kind";
import { buildContext, type BuildContextParams } from "./buildContext";
import { type DP, E, kindClass } from "@duplojs/utils";
import { printer } from "./printer";

export class DataParserToDataParserRenderError extends kindClass(
	createToDataParserKind("data-parser-to-data-parser-render-error"),
	Error,
) {
	public constructor(
		public dataParser: DP.DataParser,
		public error: DataParserNotSupportedEither | DataParserErrorEither | DataParserGetDefinitionErrorEither,
	) {
		super({}, "Error during the render of dataParser in dataParser.");
	}
}

export class DataParserToDataParserTypeRenderError extends kindClass(
	createToDataParserKind("data-parser-to-data-parser-type-render-error"),
	Error,
) {
	public constructor(
		public dataParser: DP.DataParser,
		public error: ToTypescriptDataParserNotSupportedEither | ToTypescriptDataParserErrorEither,
	) {
		super({}, "Error during the render of recursive dataParser type.");
	}
}

export interface RenderParams extends BuildContextParams {

	/**
	 * @deprecated use importContext
	 */
	readonly importType?: TST.MapImportType;
}

export function render(dataParser: DP.DataParser, params: RenderParams) {
	const context: MapContext = new Map(params.context);
	const typescriptContext = new Map(params.typescriptContext);
	const importContext: TST.MapImportContext = TST.createImportContext(
		params.importContext,
		params.importType,
	);

	const result = buildContext(dataParser, {
		...params,
		context,
		typescriptContext,
		importContext,
	});

	if (
		E.hasInformation(result, "buildDataParserError")
		|| E.hasInformation(result, "dataParserNotSupport")
		|| E.hasInformation(result, "buildDataParserGetDefinitionError")
	) {
		throw new DataParserToDataParserRenderError(
			dataParser,
			result,
		);
	} else if (
		E.hasInformation(result, "toTypescriptBuildDataParserError")
		|| E.hasInformation(result, "toTypescriptDataParserNotSupport")
	) {
		throw new DataParserToDataParserTypeRenderError(
			dataParser,
			result,
		);
	}

	return printer(
		result,
	);
}
