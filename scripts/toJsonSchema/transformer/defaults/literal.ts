import { A, DP, isType, justReturn, P, pipe } from "@duplojs/utils";
import { createTransformer, type SupportedVersionsUrl } from "../create";

type JsonPrimitive = string | number | boolean | null;
type JsonType = "string" | "number" | "integer" | "boolean" | "null";

export type JsonSchemaLiteral = {
	const: JsonPrimitive;
	type: JsonType;
} | {
	enum: readonly [JsonPrimitive];
	type: JsonType;
} | {
	enum: readonly [null];
};

interface ReduceResult {
	literals: JsonSchemaLiteral[];
	canBeUndefined: boolean;
}

type OldVersions =
	| "http://json-schema.org/draft-04/schema#"
	| "https://spec.openapis.org/oas/3.0.3";

function isOldVersion(
	version: SupportedVersionsUrl,
): version is OldVersions {
	return (
		version === "http://json-schema.org/draft-04/schema#"
		|| version === "https://spec.openapis.org/oas/3.0.3"
	);
}

export const literalTransformer = createTransformer(
	DP.literalKind.has,
	(
		schema,
		{
			success,
			version,
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
								isOldVersion(version)
									? {
										enum: [value.toString()],
										type: "string",
									}
									: {
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
								isOldVersion(version)
									? {
										enum: [value],
										type: "string",
									}
									: {
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
								isOldVersion(version)
									? {
										enum: [value],
										type: Number.isInteger(value)
											? "integer"
											: "number",
									}
									: {
										const: value,
										type: Number.isInteger(value)
											? "integer"
											: "number",
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
								isOldVersion(version)
									? {
										enum: [value],
										type: "boolean",
									}
									: {
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
								P.match(version)
									.with(
										"https://spec.openapis.org/oas/3.0.3",
										justReturn(<const>{
											enum: [null],
										}),
									)
									.with(
										"http://json-schema.org/draft-04/schema#",
										justReturn(<const>{
											type: "null",
											enum: [null],
										}),
									)
									.otherwise(justReturn({
										type: "null",
										const: null,
									})),
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
