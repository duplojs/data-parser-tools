import { dataParserInit } from "@duplojs/utils/dataParser";

declare module "@duplojs/utils/dataParser" {
	interface DataParser {

		/**
		 * @deprecated this method mutated the dataParser by adding an identifier
		 */
		setIdentifier(input: string): this;
		addIdentifier(input: string): this;
	}

	interface DataParserDefinition {
		identifier?: string;
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
