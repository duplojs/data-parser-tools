import "@scripts/toDataParser/override";
import { DP, DPE, justReturn } from "@duplojs/utils";
import { factory } from "typescript";
import { defaultCheckerTransformers, defaultTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";
import { type TransformerBuildFunction } from "@scripts/toDataParser/dataParserTransformer";

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

		const newSchemaWithChecker = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setIdentifier("test1");

		expect(newSchemaWithChecker.definition.identifier).toBe("test");
	});

	it("setOverrideDataParserTransformer", () => {
		const schema = DP.string();

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);

		schema.setOverrideDataParserTransformer(
			factory.createCallExpression(
				factory.createIdentifier("test"),
				undefined,
				[],
			),
		);

		expect(typeof schema.definition.overrideDataParserTransformer).toBe("function");
	});

	it("addOverrideDataParserTransformer", () => {
		const schema = DP.string();
		const overrideTransformer: TransformerBuildFunction = (__, { success }) => success(
			factory.createCallExpression(
				factory.createIdentifier("test"),
				undefined,
				[],
			),
		);

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);

		const newSchema = schema.addOverrideDataParserTransformer(overrideTransformer);

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);
		expect(newSchema.definition.overrideDataParserTransformer).toBe(overrideTransformer);

		const newSchemaWithChecker = newSchema.addChecker(DP.checkerRefine(justReturn(true)));

		schema.setOverrideDataParserTransformer(
			factory.createCallExpression(
				factory.createIdentifier("test1"),
				undefined,
				[],
			),
		);

		expect(newSchemaWithChecker.definition.overrideDataParserTransformer).toBe(overrideTransformer);
	});

	it("uses overrideDataParserTransformer in render", () => {
		const schema = DPE.string().addOverrideDataParserTransformer(
			(__, { success, dependencyIdentifier }) => success(
				factory.createCallExpression(
					factory.createPropertyAccessExpression(
						dependencyIdentifier,
						factory.createIdentifier("number"),
					),
					undefined,
					[],
				),
			),
		);

		const result = render(
			schema,
			{
				identifier: "override",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
			},
		);

		expect(result).toContain("export const overrideDataParser = DP.number();");
	});
});
