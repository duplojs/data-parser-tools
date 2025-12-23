import { A, DP, P } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaString {
	type: "string" | ("string" | "number" | "boolean" | "null")[];
	pattern?: string;
	format?: "uri" | "email";
	minLength?: number;
	maxLength?: number;
}

export const stringTransformer = createTransformer(
	DP.stringKind.has,
	(
		schema,
		{
			success,
			mode,
		},
	) => {
		const definition = A.reduce(
			schema.definition.checkers,
			A.reduceFrom<JsonSchemaString>({ type: "string" }),
			({ element: checker, lastValue, nextWithObject, next }) => P.match(checker)
				.when(
					DP.checkerStringMinKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ minLength: definition.min },
					),
				)
				.when(
					DP.checkerStringMaxKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ maxLength: definition.max },
					),
				)
				.when(
					DP.checkerStringRegexKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{ pattern: definition.regex.source },
					),
				)
				.when(
					DP.checkerUrlKind.has,
					() => nextWithObject(
						lastValue,
						{ format: "uri" },
					),
				)
				.when(
					DP.checkerEmailKind.has,
					({ definition }) => nextWithObject(
						lastValue,
						{
							format: "email",
							pattern: lastValue.pattern ?? definition.pattern.source,
						},
					),
				)
				.otherwise(() => next(lastValue)),
		);

		if (schema.definition.coerce && mode === "in") {
			return success({
				...definition,
				type: ["string", "number", "boolean", "null"],
			});
		}

		return success(definition);
	},
);
