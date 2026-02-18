import { dataParserInit } from "@duplojs/utils/dataParser";
import { type TransformerMode, type TransformerSuccess } from "./transformer/create";

export type OverrideJsonSchemaDataParser = Partial<
	Record<TransformerMode, TransformerSuccess>
>;

declare module "@duplojs/utils/dataParser" {
	interface DataParser {

		/**
		 * @deprecated this method mutated the dataParser by adding an identifier
		 */
		setIdentifier(input: string): this;
		addIdentifier(input: string): this;

		/**
		 * @deprecated this method mutated the dataParser by adding an override json schema
		 */
		setOverrideJsonSchema(schema: TransformerSuccess | OverrideJsonSchemaDataParser): this;
		addOverrideJsonSchema(schema: TransformerSuccess | OverrideJsonSchemaDataParser): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideJsonSchema?: OverrideJsonSchemaDataParser;
	}
}

dataParserInit.overrideHandler.setMethod(
	"setIdentifier",
	(schema, identifier) => {
		schema.definition.identifier = identifier;

		return schema;
	},
);

dataParserInit.overrideHandler.setMethod(
	"addIdentifier",
	(schema, identifier) => {
		const newSchema = schema.clone();

		newSchema.setIdentifier(identifier);

		return newSchema;
	},
);

dataParserInit.overrideHandler.setMethod(
	"setOverrideJsonSchema",
	(schema, overrideJsonSchema) => {
		schema.definition.overrideJsonSchema = "schema" in overrideJsonSchema
			? {
				in: overrideJsonSchema,
				out: overrideJsonSchema,
			}
			: overrideJsonSchema;

		return schema;
	},
);

dataParserInit.overrideHandler.setMethod(
	"addOverrideJsonSchema",
	(schema, overrideJsonSchema) => {
		const newSchema = schema.clone();

		newSchema.setOverrideJsonSchema(overrideJsonSchema);

		return newSchema;
	},
);
