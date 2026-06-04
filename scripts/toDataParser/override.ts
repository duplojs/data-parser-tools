import { DataParserBase } from "@duplojs/utils/dataParser";
import type { CallExpression, Identifier } from "typescript";
import type { TransformerBuildFunction } from "./dataParserTransformer";

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
			transformer: CallExpression | Identifier | TransformerBuildFunction<this> | null,
		): this;
		addOverrideDataParserTransformer(
			transformer: CallExpression | Identifier | TransformerBuildFunction<this> | null,
		): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideDataParserTransformer?: TransformerBuildFunction;
	}
}

DataParserBase.prototype.setIdentifier = function(this: DataParserBase, identifier) {
	this.definition.identifier = identifier;

	return this;
};

DataParserBase.prototype.addIdentifier = function(this: DataParserBase, identifier) {
	const newSchema = this.clone();

	newSchema.setIdentifier(identifier);

	return newSchema;
};

DataParserBase.prototype.setOverrideDataParserTransformer = function(this: DataParserBase, overrideTransformer) {
	if (overrideTransformer) {
		this.definition.overrideDataParserTransformer = typeof overrideTransformer === "function"
			? overrideTransformer
			: (__, { success }) => success(overrideTransformer);
	} else {
		this.definition.overrideDataParserTransformer = undefined;
	}

	return this;
};

DataParserBase.prototype.addOverrideDataParserTransformer = function(this: DataParserBase, overrideTransformer) {
	const newSchema = this.clone();

	newSchema.setOverrideDataParserTransformer(overrideTransformer);

	return newSchema;
};
