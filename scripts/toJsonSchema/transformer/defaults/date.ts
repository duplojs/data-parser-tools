import { DP, D } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaDate {
	type: "string";
	pattern?: string;
	format?: "date" | "date-time" | "string" | "number";
}

export const dateTransformer = createTransformer(
	DP.dateKind.has,
	(
		schema,
		{
			success,
			mode,
		},
	) => {
		const base = {
			type: "string",
			pattern: D.theDateRegex.source,
			format: "date-time",
		};

		if (mode === "in" && schema.definition.coerce) {
			return success({
				anyOf: [
					base,
					{ type: "number" },
					{
						type: "string",
						format: "date",
					},
					{
						type: "string",
						format: "date-time",
					},
				],
			});
		}

		return success(base);
	},
);
