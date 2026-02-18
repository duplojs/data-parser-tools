import "@scripts/toJsonSchema/override";
import { DP, justReturn } from "@duplojs/utils";
import { type JsonSchema, type TransformerBuildFunction } from "@scripts/toJsonSchema/transformer/create";

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
