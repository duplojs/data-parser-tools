import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaBoolean {
	type: "boolean";
}

export const booleanTransformer = createTransformer(
	DP.booleanKind.has,
	(
		schema,
		{
			success,
			mode,
		},
	) => {
		const base = { type: "boolean" };

		if (schema.definition.coerce && mode === "in") {
			return success({
				anyOf: [
					base,
					{
						type: "string",
						enum: ["true", "false", "0", "1"],
					},
					{
						type: "number",
						enum: [0, 1],
					},
				],
			});
		}

		return success(base);
	},
);
