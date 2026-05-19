import { dataParserBaseInit } from "@duplojs/utils/dataParser";
import { type CallExpression } from "typescript";
import { type TransformerBuildFunction } from "./dataParserTransformer";

declare module "@duplojs/utils/dataParser" {
	interface DataParserBase {

		/**
		 * @deprecated this method mutated the dataParser by adding an identifier
		 */
		setConstName(input: string): this;
		addConstName(input: string): this;

		/**
		 * @deprecated this method mutated the dataParser by adding an override transformer
		 */
		setOverrideDataParserTransformer(
			transformer: CallExpression | TransformerBuildFunction<this> | null,
		): this;
		addOverrideDataParserTransformer(
			transformer: CallExpression | TransformerBuildFunction<this> | null,
		): this;
	}

	interface DataParserDefinition {
		constName?: string;
		overrideDataParserTransformer?: TransformerBuildFunction;
	}
}

dataParserBaseInit.overrideHandler.setMethod(
	"setConstName",
	(schema, constName) => {
		schema.definition.constName = constName;

		return schema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"addConstName",
	(schema, identifier) => {
		const newSchema = schema.clone();

		newSchema.setConstName(identifier);

		return newSchema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"setOverrideDataParserTransformer",
	(schema, overrideTransformer) => {
		if (overrideTransformer) {
			schema.definition.overrideDataParserTransformer = typeof overrideTransformer === "function"
				? overrideTransformer
				: (__, { success }) => success(overrideTransformer);
		} else {
			schema.definition.overrideDataParserTransformer = undefined;
		}

		return schema;
	},
);

dataParserBaseInit.overrideHandler.setMethod(
	"addOverrideDataParserTransformer",
	(schema, overrideTransformer) => {
		const newSchema = schema.clone();

		newSchema.setOverrideDataParserTransformer(overrideTransformer);

		return newSchema;
	},
);
