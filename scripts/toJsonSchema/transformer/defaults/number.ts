import { A, DP, P } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaNumber {
	type: "number" | "integer";
	minimum?: number;
	maximum?: number;
}

export const numberTransformer = createTransformer(
	DP.numberKind.has,
	(
		schema,
		{
			success,
			mode,
		},
	) => {
		const numberSchema = A.reduce(
			schema.definition.checkers,
			A.reduceFrom<JsonSchemaNumber>({ type: "number" }),
			({ element: checker, lastValue, nextWithObject, next }) => P.match(checker)
				.when(
					DP.checkerNumberMinKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ minimum: definition.min },
					),
				)
				.when(
					DP.checkerNumberMaxKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ maximum: definition.max },
					),
				)
				.when(
					DP.checkerIntKind.has,
					() => nextWithObject(
						lastValue,
						{ type: "integer" },
					),
				)
				.otherwise(() => next(lastValue)),
		);

		if (schema.definition.coerce && mode === "in") {
			return success({
				anyOf: [
					numberSchema,
					{ type: "string" },
				],
			});
		}

		return success(numberSchema);
	},
);
