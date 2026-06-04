import "@scripts/toJsonSchema/override";
import { asserts, DP, DPE, forwardAsserts, justReturn } from "@duplojs/utils";
import { type JsonSchema, type TransformerBuildFunction } from "@scripts/toJsonSchema/transformer/create";

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

	it("setOverrideJsonSchemaTransformer", () => {
		const schema = DP.string();
		const overrideSchema: JsonSchema = {
			type: "string",
			format: "email",
		};

		expect(schema.definition.overrideJsonSchemaTransformer).toBe(undefined);

		schema.setOverrideJsonSchemaTransformer({
			schema: overrideSchema,
			isOptional: true,
		});

		expect(typeof schema.definition.overrideJsonSchemaTransformer).toBe("function");
	});

	it("addOverrideJsonSchemaTransformer", () => {
		const schema = DP.string();
		const overrideTransformer: TransformerBuildFunction = (__, { success }) => success(
			{ type: "integer" },
			false,
		);

		expect(schema.definition.overrideJsonSchemaTransformer).toBe(undefined);

		const newSchema = schema.addOverrideJsonSchemaTransformer(overrideTransformer);

		expect(schema.definition.overrideJsonSchemaTransformer).toBe(undefined);
		expect(newSchema.definition.overrideJsonSchemaTransformer).toBe(overrideTransformer);

		const newSchemaWithChecker = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setOverrideJsonSchemaTransformer({
			schema: { type: "string" },
			isOptional: true,
		});

		expect(newSchemaWithChecker.definition.overrideJsonSchemaTransformer).toBe(overrideTransformer);
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

	it("setOverrideJsonSchemaTransformer", () => {
		const schema = DPE.string();
		const overrideSchema: JsonSchema = {
			type: "string",
			format: "email",
		};

		expect(schema.definition.overrideJsonSchemaTransformer).toBe(undefined);

		asserts(
			schema.setOverrideJsonSchemaTransformer({
				schema: overrideSchema,
				isOptional: true,
			}),
			DP.dataParserExtendedKind.has,
		);

		expect(typeof schema.definition.overrideJsonSchemaTransformer).toBe("function");
	});

	it("addOverrideJsonSchemaTransformer", () => {
		const schema = DPE.string();
		const overrideTransformer: TransformerBuildFunction = (__, { success }) => success(
			{ type: "integer" },
			false,
		);

		expect(schema.definition.overrideJsonSchemaTransformer).toBe(undefined);

		const newSchema = forwardAsserts(
			schema.addOverrideJsonSchemaTransformer(overrideTransformer),
			DP.dataParserExtendedKind.has,
		);

		expect(schema.definition.overrideJsonSchemaTransformer).toBe(undefined);
		expect(newSchema.definition.overrideJsonSchemaTransformer).toBe(overrideTransformer);

		const newSchemaWithChecker = newSchema.refine(justReturn(true));

		schema.setOverrideJsonSchemaTransformer({
			schema: { type: "string" },
			isOptional: true,
		});

		expect(newSchemaWithChecker.definition.overrideJsonSchemaTransformer).toBe(overrideTransformer);
	});
});
