import { DP, E, P, pipe, unwrap } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaNullableAnyOf {
	anyOf: [JsonSchema, { type: "null" }];
}

export const nullableTransformer = createTransformer(
	DP.nullableKind.has,
	(
		schema,
		{
			transformer,
			success,
			mode,
		},
	) => {
		const innerResult = transformer(schema.definition.inner);

		if (E.isLeft(innerResult)) {
			return innerResult;
		}

		const inner = unwrap(innerResult);

		return pipe(
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
					() => ({
						anyOf: [
							inner.schema,
							{ type: "null" },
						],
					}),
				)
				.with(
					{ mode: "out" },
					() => inner.schema,
				)
				.exhaustive(),
			(schema) => success(schema, inner.isOptional),
		);
	},
);
