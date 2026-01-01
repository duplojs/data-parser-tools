import { A, DP, E, pipe, when } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaTuple {
	type: "array";
	items: JsonSchema[];
	minItems: number;
	maxItems?: number;
	additionalItems: JsonSchema | false;
}

export const tupleTransformer = createTransformer(
	DP.tupleKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => {
		const itemsResult = A.reduce(
			schema.definition.shape,
			A.reduceFrom<JsonSchema[]>([]),
			({ element, lastValue, exit, nextPush }) => pipe(
				transformer(element),
				when(
					E.isLeft,
					exit,
				),
				E.whenIsRight(
					(item) => nextPush(lastValue, item.schema),
				),
			),
		);

		if (E.isLeft(itemsResult)) {
			return itemsResult;
		}

		const baseSchema = {
			type: "array",
			items: itemsResult,
			minItems: itemsResult.length,
			additionalItems: false,
		};

		if (schema.definition.rest) {
			return pipe(
				schema.definition.rest,
				transformer,
				E.whenIsRight(
					({ schema }) => success({
						...baseSchema,
						additionalItems: schema,
					}),
				),
			);
		}

		return success({
			...baseSchema,
			maxItems: itemsResult.length,
		});
	},
);
