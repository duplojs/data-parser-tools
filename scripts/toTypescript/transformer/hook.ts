import type { DP } from "@duplojs/utils";
import type { MapContext, MapImportContext } from "./create";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	schema: DP.DataParsers;
	action: TransformerHookAction;
}

export interface TransformerHookParams {
	schema: DP.DataParsers;
	context: MapContext;
	importContext: MapImportContext;

	/**
	 * @deprecated use importContext
	 */
	importType: MapImportContext;

	output(
		action: TransformerHookAction,
		schema: DP.DataParsers
	): TransformerHookOutput;
}

export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;
