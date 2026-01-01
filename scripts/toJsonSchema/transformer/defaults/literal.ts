import { A, DP, isType, P, pipe } from "@duplojs/utils";
import { createTransformer, type JsonSchema } from "../create";

export interface JsonSchemaLiteral {
	const?: string | number | boolean | null;
	type?: "string" | "number" | "integer" | "boolean" | "null";
}

interface ReduceResult {
	literals: JsonSchema[];
	canBeUndefined: boolean;
}

export const literalTransformer = createTransformer(
	DP.literalKind.has,
	(
		schema,
		{
			success,
		},
	) => {
		const reduced = A.reduce(
			schema.definition.value,
			A.reduceFrom<ReduceResult>({
				literals: [],
				canBeUndefined: false,
			}),
			({
				element,
				lastValue,
				next,
				nextWithObject,
			}) => P.match(element)
				.when(
					isType("undefined"),
					() => nextWithObject(
						lastValue,
						{ canBeUndefined: true },
					),
				)
				.when(
					isType("bigint"),
					(value) => nextWithObject(
						lastValue,
						{
							literals: A.push(
								lastValue.literals,
								{
									const: value.toString(),
									type: "string",
								},
							),
						},
					),
				)
				.when(
					isType("string"),
					(value) => nextWithObject(
						lastValue,
						{
							literals: A.push(
								lastValue.literals,
								{
									const: value,
									type: "string",
								},
							),
						},
					),
				)
				.when(
					isType("number"),
					(value) => nextWithObject(
						lastValue,
						{
							literals: A.push(
								lastValue.literals,
								{
									const: value,
									type: Number.isInteger(value) ? "integer" : "number",
								},
							),
						},
					),
				)
				.when(
					isType("boolean"),
					(value) => nextWithObject(
						lastValue,
						{
							literals: A.push(
								lastValue.literals,
								{
									const: value,
									type: "boolean",
								},
							),
						},
					),
				)
				.when(
					isType("null"),
					() => nextWithObject(
						lastValue,
						{
							literals: A.push(
								lastValue.literals,
								{
									const: null,
									type: "null",
								},
							),
						},
					),
				)
				.otherwise(() => next(lastValue)),
		);

		const schemaDefinition = pipe(
			reduced.literals,
			P.when(
				A.lengthEqual(0),
				() => ({}),
			),
			P.when(
				A.lengthEqual(1),
				A.first,
			),
			P.otherwise((value) => ({ anyOf: value })),
		);

		return success(schemaDefinition, reduced.canBeUndefined);
	},
);
