import { DP, P } from "@duplojs/utils";
import { createTransformer } from "../create";

export const transformTransformer = createTransformer(
	DP.transformKind.has,
	(
		schema,
		{
			transformer,
			success,
			mode,
		},
	) => P.match(mode)
		.with(
			"in",
			() => transformer(schema.definition.inner),
		)
		.with(
			"out",
			() => success({}),
		)
		.exhaustive(),
);
