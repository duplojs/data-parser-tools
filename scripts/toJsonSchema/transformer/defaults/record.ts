import { A, DP, E, O, unwrap } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaRecord {
	type: "object";
	properties?: Record<string, JsonSchema>;
	required?: string[];
	additionalProperties: JsonSchema | boolean;
	propertyNames: JsonSchema;
	minProperties?: number;
	maxProperties?: number;
}

export const recordTransformer = createTransformer(
	DP.recordKind.has,
	(
		{ definition: { key, value, baseData } },
		{
			transformer,
			success,
		},
	) => {
		const keyResult = transformer(key);

		if (E.isLeft(keyResult)) {
			return keyResult;
		}

		const valueResult = transformer(value);

		if (E.isLeft(valueResult)) {
			return valueResult;
		}

		const keySchema = unwrap(keyResult).schema;
		const valueSchema = unwrap(valueResult).schema;

		const requireKey = O.keys(baseData);

		if (A.minElements(requireKey, 1)) {
			const properties = A.reduce(
				requireKey,
				A.reduceFrom<Record<string, JsonSchema>>({}),
				({ element, lastValue, nextWithObject }) => nextWithObject(
					lastValue,
					{ [element]: valueSchema },
				),
			);

			return success({
				type: "object",
				properties,
				required: requireKey,
				additionalProperties: false,
				propertyNames: { enum: requireKey },
				minProperties: requireKey.length,
			});
		}

		return success({
			type: "object",
			propertyNames: keySchema,
			additionalProperties: valueSchema,
		});
	},
);
