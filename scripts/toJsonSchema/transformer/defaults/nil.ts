import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaNil {
	type: "null";
}

export const nilTransformer = createTransformer(
	DP.nilKind.has,
	(
		__schema,
		{ success },
	) => success({ type: "null" }),
);
