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
		setOverrideDataParserTransformer<
			GenericSelf extends DataParserBase = this,
		>(
			transformer: CallExpression | Identifier | TransformerBuildFunction<this> | null,
		): GenericSelf;
		addOverrideDataParserTransformer<
			GenericSelf extends DataParserBase = this,
		>(
			transformer: CallExpression | Identifier | TransformerBuildFunction<this> | null,
		): GenericSelf;
	}

	interface DataParserDefinition {
		overrideDataParserTransformer?: TransformerBuildFunction;
	}

	interface DataParserCheckerBase {

		/**
		 * @deprecated this method mutated the checker by adding an override refiner
		 */
		setOverrideCheckerTransformer<
			GenericSelf extends DataParserCheckerBase = this,
		>(
			typeNode: CallExpression | Identifier | CheckerTransformerBuildFunction<this> | null
		): GenericSelf;
		addOverrideCheckerTransformer<
			GenericSelf extends DataParserCheckerBase = this,
		>(
			typeNode: CallExpression | Identifier | CheckerTransformerBuildFunction<this> | null
		): GenericSelf;
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

	return this as never;
};

DataParserBase.prototype.addOverrideDataParserTransformer = function(this: DataParserBase, overrideTransformer) {
	const newSchema = this.clone();

	newSchema.setOverrideDataParserTransformer(overrideTransformer);

	return newSchema as never;
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

	return this as never;
};

DataParserCheckerBase.prototype.addOverrideCheckerTransformer = function(
	this: DataParserCheckerBase,
	overrideTransformer,
) {
	const newSchema = this.clone();

	newSchema.setOverrideCheckerTransformer(overrideTransformer);

	return newSchema as never;
};

