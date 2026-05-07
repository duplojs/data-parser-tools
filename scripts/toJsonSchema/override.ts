import { dataParserBaseInit } from "@duplojs/utils/dataParser";
import { type TransformerBuildFunction, type TransformerSuccess } from "./transformer/create";

declare module "@duplojs/utils/dataParser" {
	interface DataParserBase {

		/**
		 * @deprecated this method mutated the dataParser by adding an identifier
		 */
		setIdentifier(input: string): this;
		addIdentifier(input: string): this;

		/**
		 * @deprecated this method mutated the dataParser by adding an override transformer
		 */
		setOverrideJsonSchemaTransformer(
			transformer: TransformerSuccess | TransformerBuildFunction<this> | null
		): this;
		addOverrideJsonSchemaTransformer(
			transformer: TransformerSuccess | TransformerBuildFunction<this> | null
		): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideJsonSchemaTransformer?: TransformerBuildFunction;
	}
}

dataParserBaseInit.overrideHandler.setMethod(
	"setIdentifier",
	(schema, identifier) => {
		schema.definition.identifier = identifier;

		return schema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"addIdentifier",
	(schema, identifier) => {
		const newSchema = schema.clone();

		newSchema.setIdentifier(identifier);

		return newSchema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"setOverrideJsonSchemaTransformer",
	(schema, overrideTransformer) => {
		if (overrideTransformer) {
			schema.definition.overrideJsonSchemaTransformer = typeof overrideTransformer === "function"
				? overrideTransformer
				: (__, { success }) => success(overrideTransformer.schema, overrideTransformer.isOptional);
		} else {
			schema.definition.overrideJsonSchemaTransformer = undefined;
		}

		return schema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"addOverrideJsonSchemaTransformer",
	(schema, overrideTransformer) => {
		const newSchema = schema.clone();

		newSchema.setOverrideJsonSchemaTransformer(overrideTransformer);

		return newSchema;
	},
);
