import { DataParserBase, DataParserCheckerBase } from "@duplojs/utils/dataParser";
import { type TypeNode } from "typescript";
import { type createAddImport, type MapImportContextValue, type TransformerBuildFunction } from "./dataParserTransformer";
import { O, type AnyTuple } from "@duplojs/utils";
import { type CheckerRefinerBuildFunction } from "./checkerRefiner";

export type MapImportContextEntry = [path: string, value: MapImportContextValue];

export function applyMapImportContextEntries(
	addImport: ReturnType<typeof createAddImport>,
	entries: AnyTuple<MapImportContextEntry>,
) {
	for (const [path, importContextValue] of entries) {
		for (const [importType, importValues] of O.entries(importContextValue)) {
			if (!importValues) {
				continue;
			}

			for (const importValue of importValues) {
				addImport(path, importValue, importType);
			}
		}
	}
}

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

		/**
		 * @deprecated this method mutated the dataParser by adding import
		 */
		setMapImportContextEntries(...args: AnyTuple<MapImportContextEntry>): this;
		addMapImportContextEntries(...args: AnyTuple<MapImportContextEntry>): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideTypescriptTransformer?: TransformerBuildFunction;
		mapImportContextEntries?: AnyTuple<MapImportContextEntry>;
	}

	interface DataParserCheckerBase {

		/**
		 * @deprecated this method mutated the checker by adding an override refiner
		 */
		setOverrideTypescriptRefiner(typeNode: TypeNode | CheckerRefinerBuildFunction<this> | null): this;
		addOverrideTypescriptRefiner(typeNode: TypeNode | CheckerRefinerBuildFunction<this> | null): this;

		/**
		 * @deprecated this method mutated the checker by adding import
		 */
		setMapImportContextEntries(...args: AnyTuple<MapImportContextEntry>): this;
		addMapImportContextEntries(...args: AnyTuple<MapImportContextEntry>): this;
	}

	interface DataParserCheckerDefinition {
		overrideTypescriptRefiner?: CheckerRefinerBuildFunction;
		mapImportContextEntries?: AnyTuple<MapImportContextEntry>;
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

DataParserBase.prototype.setMapImportContextEntries = function(this: DataParserBase, ...importValues) {
	this.definition.mapImportContextEntries = importValues;

	return this;
};

DataParserBase.prototype.addMapImportContextEntries = function(this: DataParserBase, ...importValues) {
	const newSchema = this.clone();

	newSchema.setMapImportContextEntries(...importValues);

	return newSchema;
};

DataParserCheckerBase.prototype.setOverrideTypescriptRefiner = function(this: DataParserCheckerBase, overrideRefiner) {
	if (overrideRefiner) {
		this.definition.overrideTypescriptRefiner = typeof overrideRefiner === "function"
			? overrideRefiner
			: (__, ___, { success }) => success(overrideRefiner);
	} else {
		this.definition.overrideTypescriptRefiner = undefined;
	}

	return this;
};

DataParserCheckerBase.prototype.addOverrideTypescriptRefiner = function(this: DataParserCheckerBase, overrideRefiner) {
	const newSchema = this.clone();

	newSchema.setOverrideTypescriptRefiner(overrideRefiner);

	return newSchema;
};

DataParserCheckerBase.prototype.setMapImportContextEntries = function(
	this: DataParserCheckerBase,
	...mapImportContextEntries
) {
	this.definition.mapImportContextEntries = mapImportContextEntries;

	return this;
};

DataParserCheckerBase.prototype.addMapImportContextEntries = function(
	this: DataParserCheckerBase,
	...mapImportContextEntries
) {
	const newSchema = this.clone();

	newSchema.setMapImportContextEntries(...mapImportContextEntries);

	return newSchema;
};
