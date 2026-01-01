import { DP, E, P, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";

export const optionalTransformer = createTransformer(
	DP.optionalKind.has,
	(
		schema,
		{
			transformer,
			success,
			mode,
		},
	) => pipe(
		schema.definition.inner,
		transformer,
		E.whenIsRight(
			(inner) => pipe(
				mode,
				P.match(
					"in",
					() => true,
				),
				P.match(
					"out",
					() => inner.canBeUndefined,
				),
				P.exhaustive,
				(value) => success(inner.schema, value),
			),
		),
	),
);
