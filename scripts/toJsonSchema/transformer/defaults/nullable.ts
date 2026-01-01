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
			mode,
			P.match(
				"in",
				() => ({
					anyOf: [
						inner.schema,
						{ type: "null" },
					],
				}),
			),
			P.match(
				"out",
				() => inner.schema,
			),
			P.exhaustive,
			(schema) => success(schema, inner.canBeUndefined),
		);
	},
);
