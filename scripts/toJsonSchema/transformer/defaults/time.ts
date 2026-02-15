import { DP, D } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaTime {
	type: "string";
	pattern?: string;
	format?: "time";
}

export const timeTransformer = createTransformer(
	DP.timeKind.has,
	(
		schema,
		{
			success,
			mode,
		},
	) => {
		const base = {
			type: "string",
			pattern: D.serializeTheTimeRegex.source,
		};

		if (mode === "in" && schema.definition.coerce) {
			return success({
				anyOf: [
					base,
					{ type: "number" },
					{
						type: "string",
						format: "time",
					},
				],
			});
		}

		return success(base);
	},
);
