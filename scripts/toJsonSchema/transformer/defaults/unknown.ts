import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export type JsonSchemaUnknown = Record<string, unknown>;

export const unknownTransformer = createTransformer(
	DP.unknownKind.has,
	(
		__schema,
		{ success },
	) => success({}),
);
