import { A, DP, E, P, pipe, unwrap } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaArray {
	type: "array";
	items: JsonSchema;
	minItems?: number;
	maxItems?: number;
}

export const arrayTransformer = createTransformer(
	DP.arrayKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => {
		const elementResult = pipe(
			schema.definition.element,
			transformer,
		);

		if (E.isLeft(elementResult)) {
			return elementResult;
		}

		const element = unwrap(elementResult);

		const definition = A.reduce(
			schema.definition.checkers,
			A.reduceFrom<JsonSchemaArray>({
				type: "array",
				items: element.schema,
			}),
			({ element: checker, lastValue, nextWithObject, next }) => P.match(checker)
				.when(
					DP.checkerArrayMinKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ minItems: definition.min },
					),
				)
				.when(
					DP.checkerArrayMaxKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ maxItems: definition.max },
					),
				)
				.otherwise(() => next(lastValue)),
		);

		return success(definition);
	},
);
