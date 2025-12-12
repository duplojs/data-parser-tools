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
			mode,
			P.match(
				"in",
				() => pipe(
					factory.createNull(),
					factory.createLiteralTypeNode,
					(value) => factory.createUnionTypeNode([
						innerType,
						value,
					]),
				),
			),
			P.match(
				"out",
				() => innerType,
			),
			P.exhaustive,
			success,
		);
	},
);
