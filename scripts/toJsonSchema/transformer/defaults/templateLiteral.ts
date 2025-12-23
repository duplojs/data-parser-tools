import { A, DP, isType, or, P, S } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaTemplateLiteral {
	type: "string";
	pattern: string;
}

function escapeRegex(value: string) {
	return S.replace(value, /[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const templateLiteralTransformer = createTransformer(
	DP.templateLiteralKind.has,
	(
		schema,
		{ success },
	) => {
		const pattern = A.reduce(
			schema.definition.template,
			A.reduceFrom<string>(""),
			({ element, lastValue, next }) => P.match(element)
				.when(
					(value) => DP.dataParserKind.has(value),
					() => next(`${lastValue}.*`),
				)
				.when(
					isType("bigint"),
					(value) => next(`${lastValue}${escapeRegex(`${value}n`)}`),
				)
				.when(
					or([
						isType("boolean"),
						isType("number"),
						isType("string"),
					]),
					(value) => next(`${lastValue}${escapeRegex(String(value))}`),
				)
				.when(
					isType("null"),
					() => next(`${lastValue}null`),
				)
				.when(
					isType("undefined"),
					() => next(`${lastValue}undefined`),
				)
				.exhaustive(),
		);

		return success({
			type: "string",
			pattern: `^${pattern}$`,
		});
	},
);
