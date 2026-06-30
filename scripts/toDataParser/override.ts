import "@scripts/toTypescript/override";
import { DataParserBase, DataParserCheckerBase } from "@duplojs/utils/dataParser";
import type { CallExpression, Identifier } from "typescript";
import type { TransformerBuildFunction } from "./dataParserTransformer";
import { type CheckerTransformerBuildFunction } from "./checkerTransformer";

declare module "@duplojs/utils/dataParser" {
	interface DataParserBase {

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
		overrideDataParserTransformer?: TransformerBuildFunction;
	}

	interface DataParserCheckerBase {

		/**
		 * @deprecated this method mutated the checker by adding an override refiner
		 */
		setOverrideCheckerTransformer(
			typeNode: CallExpression | Identifier | CheckerTransformerBuildFunction<this> | null
		): this;
		addOverrideCheckerTransformer(
			typeNode: CallExpression | Identifier | CheckerTransformerBuildFunction<this> | null
		): this;
	}

	interface DataParserCheckerDefinition {
		overrideCheckerTransformer?: CheckerTransformerBuildFunction;
	}
}

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

DataParserCheckerBase.prototype.setOverrideCheckerTransformer = function(
	this: DataParserCheckerBase,
	overrideTransformer,
) {
	if (overrideTransformer) {
		this.definition.overrideCheckerTransformer = typeof overrideTransformer === "function"
			? overrideTransformer
			: (__, { success }) => success(overrideTransformer);
	} else {
		this.definition.overrideCheckerTransformer = undefined;
	}

	return this;
};

DataParserCheckerBase.prototype.addOverrideCheckerTransformer = function(
	this: DataParserCheckerBase,
	overrideTransformer,
) {
	const newSchema = this.clone();

	newSchema.setOverrideCheckerTransformer(overrideTransformer);

	return newSchema;
};

