import type { DP } from "@duplojs/utils";
import type * as TST from "@scripts/toTypescript";
import type { MapContext } from "./create";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	dataParser: DP.DataParser;
	action: TransformerHookAction;
}

export interface TransformerHookParams {
	dataParser: DP.DataParser;
	context: MapContext;
	importContext: TST.MapImportContext;

	output(
		action: TransformerHookAction,
		dataParser: DP.DataParser
	): TransformerHookOutput;
}

export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;
