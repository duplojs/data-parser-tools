import { DP, E, P, pipe, unwrap } from "@duplojs/utils";
import { factory } from "typescript";
import { createTransformer } from "../create";

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

		const innerType = unwrap(innerResult);

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
					() => pipe(
						factory.createNull(),
						factory.createLiteralTypeNode,
						(value) => factory.createUnionTypeNode([
							innerType,
							value,
						]),
					),
				)
				.with(
					{ mode: "out" },
					() => innerType,
				)
				.exhaustive(),
			success,
		);
	},
);
