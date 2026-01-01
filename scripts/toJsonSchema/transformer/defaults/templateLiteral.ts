import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export interface JsonSchemaTemplateLiteral {
	type: "string";
	pattern: string;
}

export const templateLiteralTransformer = createTransformer(
	DP.templateLiteralKind.has,
	(
		schema,
		{
			success,
			transformer,
		},
	) => {
		const result = DP.findRecordRequiredKeyOnTemplateLiteralPart(schema.definition.template);

		if (result) {
			return transformer(DP.literal(result));
		}

		return success({
			type: "string",
			pattern: schema.definition.pattern.source,
		});
	},
);
