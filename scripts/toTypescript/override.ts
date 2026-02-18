import { dataParserInit } from "@duplojs/utils/dataParser";
import { type TypeNode } from "typescript";
import { type TransformerMode } from "./transformer";

export type OverrideTypeNodeDataParser = Partial<
	Record<TransformerMode, TypeNode>
>;

declare module "@duplojs/utils/dataParser" {
	interface DataParser {

		/**
		 * @deprecated this method mutated the dataParser by adding an identifier
		 */
		setIdentifier(input: string): this;
		addIdentifier(input: string): this;

		/**
		 * @deprecated this method mutated the dataParser by adding an override type node
		 */
		setOverrideTypeNode(typeNode: TypeNode | OverrideTypeNodeDataParser): this;
		addOverrideTypeNode(typeNode: TypeNode | OverrideTypeNodeDataParser): this;
	}

	interface DataParserDefinition {
		identifier?: string;
		overrideTypeNode?: OverrideTypeNodeDataParser;
	}
}

dataParserInit.overrideHandler.setMethod(
	"setIdentifier",
	(schema, identifier) => {
		schema.definition.identifier = identifier;

		return schema;
	},
);

dataParserInit.overrideHandler.setMethod(
	"addIdentifier",
	(schema, identifier) => {
		const newSchema = schema.clone();

		newSchema.setIdentifier(identifier);

		return newSchema;
	},
);

dataParserInit.overrideHandler.setMethod(
	"setOverrideTypeNode",
	(schema, overrideTypeNode) => {
		schema.definition.overrideTypeNode = "kind" in overrideTypeNode
			? {
				in: overrideTypeNode,
				out: overrideTypeNode,
			}
			: overrideTypeNode;

		return schema;
	},
);

dataParserInit.overrideHandler.setMethod(
	"addOverrideTypeNode",
	(schema, overrideTypeNode) => {
		const newSchema = schema.clone();

		newSchema.setOverrideTypeNode(overrideTypeNode);

		return newSchema;
	},
);
