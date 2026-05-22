import type { DP } from "@duplojs/utils";
import type * as TST from "@scripts/toTypescript";
import type { MapContext } from "./create";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	dataParser: DP.DataParsers;
	action: TransformerHookAction;
}

export interface TransformerHookParams {
	dataParser: DP.DataParsers;
	context: MapContext;
	importContext: TST.MapImportContext;

	output(
		action: TransformerHookAction,
		dataParser: DP.DataParsers
	): TransformerHookOutput;
}

export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;
