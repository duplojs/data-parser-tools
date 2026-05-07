import { dataParserBaseInit } from "@duplojs/utils/dataParser";
import { type TypeNode } from "typescript";
import { type TransformerBuildFunction } from "./transformer";

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
		setOverrideTypescriptTransformer(typeNode: TypeNode | TransformerBuildFunction<this> | null): this;
		addOverrideTypescriptTransformer(typeNode: TypeNode | TransformerBuildFunction<this> | null): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideTypescriptTransformer?: TransformerBuildFunction;
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
	"setOverrideTypescriptTransformer",
	(schema, overrideTransformer) => {
		if (overrideTransformer) {
			schema.definition.overrideTypescriptTransformer = typeof overrideTransformer === "function"
				? overrideTransformer
				: (__, { success }) => success(overrideTransformer);
		} else {
			schema.definition.overrideTypescriptTransformer = undefined;
		}

		return schema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"addOverrideTypescriptTransformer",
	(schema, overrideTypeNode) => {
		const newSchema = schema.clone();

		newSchema.setOverrideTypescriptTransformer(overrideTypeNode);

		return newSchema;
	},
);
