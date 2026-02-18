import "@scripts/toJsonSchema/override";
import { DP, justReturn } from "@duplojs/utils";
import { type JsonSchema } from "@scripts/toJsonSchema/transformer/create";

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

	it("setOverrideJsonSchema", () => {
		const schema = DP.string();
		const overrideSchema: JsonSchema = {
			type: "string",
			format: "email",
		};

		expect(schema.definition.overrideJsonSchema).toBe(undefined);

		schema.setOverrideJsonSchema({
			schema: overrideSchema,
			isOptional: true,
		});

		expect(schema.definition.overrideJsonSchema).toStrictEqual({
			in: {
				schema: {
					type: "string",
					format: "email",
				},
				isOptional: true,
			},
			out: {
				schema: {
					type: "string",
					format: "email",
				},
				isOptional: true,
			},
		});
	});

	it("addOverrideJsonSchema", () => {
		const schema = DP.string();

		expect(schema.definition.overrideJsonSchema).toBe(undefined);

		const newSchema = schema.addOverrideJsonSchema({
			in: {
				schema: { type: "integer" },
				isOptional: false,
			},
		});

		expect(schema.definition.overrideJsonSchema).toBe(undefined);
		expect(newSchema.definition.overrideJsonSchema).toStrictEqual({
			in: {
				schema: { type: "integer" },
				isOptional: false,
			},
		});

		const newSchemaWithChecker = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setOverrideJsonSchema({
			schema: { type: "string" },
			isOptional: true,
		});

		expect(newSchemaWithChecker.definition.overrideJsonSchema).toStrictEqual({
			in: {
				schema: { type: "integer" },
				isOptional: false,
			},
		});
	});
});
