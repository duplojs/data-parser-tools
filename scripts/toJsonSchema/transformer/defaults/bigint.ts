import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaBigInt {
	type: "integer";
}

export const bigIntTransformer = createTransformer(
	DP.bigIntKind.has,
	(
		schema,
		{
			success,
			mode,
		},
	) => {
		const base = { type: "integer" };

		if (schema.definition.coerce && mode === "in") {
			return success({
				anyOf: [
					base,
					{ type: "string" },
				],
			});
		}

		return success(base);
	},
);
