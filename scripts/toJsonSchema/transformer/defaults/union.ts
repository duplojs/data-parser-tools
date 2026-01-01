import { A, DP, E, pipe, when } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaUnion {
	anyOf: JsonSchema[];
}

export const unionTransformer = createTransformer(
	DP.unionKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => {
		let canBeUndefined = false;

		const optionsResult = A.reduce(
			schema.definition.options,
			A.reduceFrom<JsonSchema[]>([]),
			({ element, lastValue, nextPush, exit }) => pipe(
				transformer(element),
				when(
					E.isLeft,
					exit,
				),
				E.whenIsRight(
					(option) => {
						canBeUndefined ||= option.canBeUndefined;
						return nextPush(lastValue, option.schema);
					},
				),
			),
		);

		if (E.isLeft(optionsResult)) {
			return optionsResult;
		}

		return success(
			{
				anyOf: optionsResult,
			},
			canBeUndefined,
		);
	},
);
