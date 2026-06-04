import "@scripts/toTypescript/override";
import { asserts, DP, DPE, forwardAsserts, justReturn } from "@duplojs/utils";
import { factory } from "typescript";
import { type TransformerBuildFunction } from "@scripts/toTypescript/transformer";

describe("DP override", () => {
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

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);

		schema.setOverrideTypescriptTransformer(factory.createTypeReferenceNode("test"));

		expect(typeof schema.definition.overrideTypescriptTransformer).toBe("function");
	});

	it("addOverrideTypeNode", () => {
		const schema = DP.string();
		const overrideTransformer: TransformerBuildFunction = (__, { success }) => success(
			factory.createTypeReferenceNode("test"),
		);

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);

		const newSchema = schema.addOverrideTypescriptTransformer(overrideTransformer);

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);
		expect(newSchema.definition.overrideTypescriptTransformer).toBe(overrideTransformer);

		const newSchemaWithoutIdentifier = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setOverrideTypescriptTransformer(factory.createTypeReferenceNode("test1"));

		expect(newSchemaWithoutIdentifier.definition.overrideTypescriptTransformer).toBe(overrideTransformer);
	});
});

describe("DPE override", () => {
	it("setIdentifier", () => {
		const schema = DPE.string();

		expect(schema.definition.identifier).toBe(undefined);

		asserts(
			schema.setIdentifier("test"),
			DP.dataParserExtendedKind.has,
		);

		expect(schema.definition.identifier).toBe("test");
	});

	it("addIdentifier", () => {
		const schema = DPE.string();

		expect(schema.definition.identifier).toBe(undefined);

		const newSchema = forwardAsserts(
			schema.addIdentifier("test"),
			DP.dataParserExtendedKind.has,
		);

		expect(schema.definition.identifier).toBe(undefined);
		expect(newSchema.definition.identifier).toBe("test");

		const newSchemaWithoutIdentifier = newSchema.refine(justReturn(true));

		schema.setIdentifier("test1");

		expect(newSchemaWithoutIdentifier.definition.identifier).toBe("test");
	});

	it("setOverrideTypeNode", () => {
		const schema = DPE.string();

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);

		asserts(
			schema.setOverrideTypescriptTransformer(factory.createTypeReferenceNode("test")),
			DP.dataParserExtendedKind.has,
		);

		expect(typeof schema.definition.overrideTypescriptTransformer).toBe("function");
	});

	it("addOverrideTypeNode", () => {
		const schema = DPE.string();
		const overrideTransformer: TransformerBuildFunction = (__, { success }) => success(
			factory.createTypeReferenceNode("test"),
		);

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);

		const newSchema = forwardAsserts(
			schema.addOverrideTypescriptTransformer(overrideTransformer),
			DP.dataParserExtendedKind.has,
		);

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);
		expect(newSchema.definition.overrideTypescriptTransformer).toBe(overrideTransformer);

		const newSchemaWithoutIdentifier = newSchema.refine(justReturn(true));

		schema.setOverrideTypescriptTransformer(factory.createTypeReferenceNode("test1"));

		expect(newSchemaWithoutIdentifier.definition.overrideTypescriptTransformer).toBe(overrideTransformer);
	});
});
