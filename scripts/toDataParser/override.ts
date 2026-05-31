import { dataParserBaseExtendedInit, dataParserBaseInit } from "@duplojs/utils/dataParser";
import type { CallExpression, Identifier } from "typescript";
import type { TransformerBuildFunction } from "./dataParserTransformer";
import { type BaseVersion } from "@scripts/utils";

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
		setOverrideDataParserTransformer(
			transformer: CallExpression | Identifier | TransformerBuildFunction<BaseVersion<this>> | null,
		): this;
		addOverrideDataParserTransformer(
			transformer: CallExpression | Identifier | TransformerBuildFunction<BaseVersion<this>> | null,
		): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideDataParserTransformer?: TransformerBuildFunction;
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

dataParserBaseExtendedInit.overrideHandler.setMethod(
	"setIdentifier",
	(schema, identifier) => {
		schema.definition.identifier = identifier;

		return schema;
	},
);

dataParserBaseExtendedInit.overrideHandler.setMethod(
	"addIdentifier",
	(schema, identifier) => {
		const newSchema = schema.clone();

		newSchema.setIdentifier(identifier);

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

dataParserBaseExtendedInit.overrideHandler.setMethod(
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

dataParserBaseExtendedInit.overrideHandler.setMethod(
	"addOverrideDataParserTransformer",
	(schema, overrideTransformer) => {
		const newSchema = schema.clone();

		newSchema.setOverrideDataParserTransformer(overrideTransformer);

		return newSchema;
	},
);
