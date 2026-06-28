import type { DP } from "@duplojs/utils";
import type { MapContext, MapImportContext } from "./create";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	schema: DP.DataParser;
	action: TransformerHookAction;
}

export interface TransformerHookParams {
	schema: DP.DataParser;
	context: MapContext;
	importContext: MapImportContext;

	output(
		action: TransformerHookAction,
		schema: DP.DataParser
	): TransformerHookOutput;
}

export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;
