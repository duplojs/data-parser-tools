import { DataParserBase } from "@duplojs/utils/dataParser";
import { type TypeNode } from "typescript";
import { type TransformerBuildFunction } from "./transformer";

declare module "@duplojs/utils/dataParser" {
	interface DataParserBase {

		/**
		 * @deprecated this method mutated the dataParser by adding an identifier
		 */
		setIdentifier(identifier: string): this;
		addIdentifier(identifier: string): this;

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

DataParserBase.prototype.setIdentifier = function(this: DataParserBase, identifier) {
	this.definition.identifier = identifier;

	return this;
};

DataParserBase.prototype.addIdentifier = function(this: DataParserBase, identifier) {
	const newSchema = this.clone();

	newSchema.setIdentifier(identifier);

	return newSchema;
};

DataParserBase.prototype.setOverrideTypescriptTransformer = function(this: DataParserBase, overrideTransformer) {
	if (overrideTransformer) {
		this.definition.overrideTypescriptTransformer = typeof overrideTransformer === "function"
			? overrideTransformer
			: (__, { success }) => success(overrideTransformer);
	} else {
		this.definition.overrideTypescriptTransformer = undefined;
	}

	return this;
};

DataParserBase.prototype.addOverrideTypescriptTransformer = function(this: DataParserBase, overrideTransformer) {
	const newSchema = this.clone();

	newSchema.setOverrideTypescriptTransformer(overrideTransformer);

	return newSchema;
};
