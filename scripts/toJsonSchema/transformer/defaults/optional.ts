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
				{
					mode,
					coalescingValue: schema.definition.coalescingValue,
				},
				(value) => P.match(value)
					.with(
						P.union(
							{ mode: "in" },
							{
								mode: "out",
								coalescingValue: undefined,
							},
						),
						() => true,
					)
					.with(
						{ mode: "out" },
						() => inner.isOptional,
					)
					.exhaustive(),
				(isOptional) => success(inner.schema, isOptional),
			),
		),
	),
);
