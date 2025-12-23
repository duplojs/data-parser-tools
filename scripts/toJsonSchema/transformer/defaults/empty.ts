import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export type JsonSchemaEmpty = Record<string, never>;

export const emptyTransformer = createTransformer(
	DP.emptyKind.has,
	(
		__schema,
		{
			success,
		},
	) => success({}, true),
);
