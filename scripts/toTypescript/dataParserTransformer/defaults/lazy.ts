import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export const lazyTransformer = createTransformer(
	DP.lazyKind.has,
	(
		schema,
		{ transformer },
	) => transformer(schema.definition.getter.value),
);
