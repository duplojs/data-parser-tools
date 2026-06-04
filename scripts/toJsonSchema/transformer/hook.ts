import { type DP } from "@duplojs/utils";
import { type MapContext } from "./create";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	schema: DP.DataParser;
	action: TransformerHookAction;
}

export interface TransformerHookParams {
	schema: DP.DataParser;
	context: MapContext;
	output(
		action: TransformerHookAction,
		schema: DP.DataParser
	): TransformerHookOutput;
}

export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;
