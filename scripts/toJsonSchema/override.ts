import { DataParserBase } from "@duplojs/utils/dataParser";
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

DataParserBase.prototype.setIdentifier = function(this: DataParserBase, identifier) {
	this.definition.identifier = identifier;

	return this;
};

DataParserBase.prototype.addIdentifier = function(this: DataParserBase, identifier) {
	const newSchema = this.clone();

	newSchema.setIdentifier(identifier);

	return newSchema;
};

DataParserBase.prototype.setOverrideJsonSchemaTransformer = function(this: DataParserBase, overrideTransformer) {
	if (overrideTransformer) {
		this.definition.overrideJsonSchemaTransformer = typeof overrideTransformer === "function"
			? overrideTransformer
			: (__, { success }) => success(overrideTransformer.schema, overrideTransformer.isOptional);
	} else {
		this.definition.overrideJsonSchemaTransformer = undefined;
	}

	return this;
};

DataParserBase.prototype.addOverrideJsonSchemaTransformer = function(this: DataParserBase, overrideTransformer) {
	const newSchema = this.clone();

	newSchema.setOverrideJsonSchemaTransformer(overrideTransformer);

	return newSchema;
};
