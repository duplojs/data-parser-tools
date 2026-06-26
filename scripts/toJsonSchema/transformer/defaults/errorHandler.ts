import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export const errorHandlerTransformer = createTransformer(
	DP.errorHandlerKind.has,
	(
		schema,
		{ transformer },
	) => transformer(schema.definition.inner),
);
