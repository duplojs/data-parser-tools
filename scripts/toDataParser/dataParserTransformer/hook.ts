import type { DP } from "@duplojs/utils";
import type { MapContext, MapImportClause } from "./create";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	dataParser: DP.DataParsers;
	action: TransformerHookAction;
}

export interface TransformerHookParams {
	dataParser: DP.DataParsers;
	context: MapContext;
	importDataParser: MapImportClause;

	output(
		action: TransformerHookAction,
		dataParser: DP.DataParsers
	): TransformerHookOutput;
}

export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;
