import "@scripts/toTypescript/override";
import { DP, justReturn } from "@duplojs/utils";
import { factory } from "typescript";

describe("override", () => {
	it("setIdentifier", () => {
		const schema = DP.string();

		expect(schema.definition.identifier).toBe(undefined);

		schema.setIdentifier("test");

		expect(schema.definition.identifier).toBe("test");
	});

	it("addIdentifier", () => {
		const schema = DP.string();

		expect(schema.definition.identifier).toBe(undefined);

		const newSchema = schema.addIdentifier("test");

		expect(schema.definition.identifier).toBe(undefined);
		expect(newSchema.definition.identifier).toBe("test");

		const newSchemaWithoutIdentifier = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setIdentifier("test1");

		expect(newSchemaWithoutIdentifier.definition.identifier).toBe("test");
	});

	it("setOverrideTypeNode", () => {
		const schema = DP.string();

		expect(schema.definition.overrideTypeNode).toBe(undefined);

		schema.setOverrideTypeNode(factory.createTypeReferenceNode("test"));

		expect(schema.definition.overrideTypeNode).toStrictEqual({
			in: factory.createTypeReferenceNode("test"),
			out: factory.createTypeReferenceNode("test"),
		});
	});

	it("addOverrideTypeNode", () => {
		const schema = DP.string();

		expect(schema.definition.overrideTypeNode).toBe(undefined);

		const newSchema = schema.addOverrideTypeNode({ in: factory.createTypeReferenceNode("test") });

		expect(schema.definition.overrideTypeNode).toBe(undefined);
		expect(newSchema.definition.overrideTypeNode).toStrictEqual({
			in: factory.createTypeReferenceNode("test"),
		});

		const newSchemaWithoutIdentifier = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setOverrideTypeNode(factory.createTypeReferenceNode("test1"));

		expect(newSchemaWithoutIdentifier.definition.overrideTypeNode).toStrictEqual({
			in: factory.createTypeReferenceNode("test"),
		});
	});
});
