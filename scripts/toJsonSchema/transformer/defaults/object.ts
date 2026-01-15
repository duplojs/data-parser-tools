import { A, DP, E, O, pipe, when } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaObject {
	type: "object";
	properties: Record<string, JsonSchema>;
	required?: string[];
}

export const objectTransformer = createTransformer(
	DP.objectKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => {
		const result = pipe(
			schema.definition.shape,
			O.entries,
			A.reduce(
				A.reduceFrom<JsonSchemaObject>({
					type: "object",
					properties: {},
					required: undefined,
				}),
				({ element: [key, value], lastValue, exit, nextWithObject }) => pipe(
					transformer(value),
					when(
						E.isLeft,
						exit,
					),
					E.whenIsRight(
						(inner) => nextWithObject(
							lastValue,
							{
								type: "object",
								properties: {
									...lastValue.properties,
									[key]: inner.schema,
								},
								required: inner.isOptional
									? lastValue.required
									: A.push(lastValue.required ?? [], key),
							},
						),
					),
				),
			),
		);

		if (E.isLeft(result)) {
			return result;
		}

		if (!result.required) {
			return success(O.omit(result, { required: true }));
		}

		return success(result);
	},
);
