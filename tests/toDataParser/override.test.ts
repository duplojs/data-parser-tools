import "@scripts/toDataParser/override";
import { type AnyTuple, asserts, DP, DPE, type ExpectType, forwardAsserts, justReturn } from "@duplojs/utils";
import { factory } from "typescript";
import { defaultCheckerTransformers, defaultTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";
import { type DataParserToDataParser, type DataParserToTypescript, type DataParserToJsonSchema } from "@scripts/index";

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
		const overrideTransformer: DataParserToDataParser.TransformerBuildFunction = (__, { success }) => success(
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

		const newSchemaWithChecker = newSchema.refine(justReturn(true));

		schema.setIdentifier("test1");

		expect(newSchemaWithChecker.definition.identifier).toBe("test");
	});

	it("setOverrideDataParserTransformer", () => {
		const schema = DPE.string();

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);

		asserts(
			schema.setOverrideDataParserTransformer(
				factory.createCallExpression(
					factory.createIdentifier("test"),
					undefined,
					[],
				),
			),
			DP.dataParserExtendedKind.has,
		);

		expect(typeof schema.definition.overrideDataParserTransformer).toBe("function");
	});

	it("addOverrideDataParserTransformer", () => {
		const schema = DPE.string();
		const overrideTransformer: DataParserToDataParser.TransformerBuildFunction = (__, { success }) => success(
			factory.createCallExpression(
				factory.createIdentifier("test"),
				undefined,
				[],
			),
		);

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);

		const newSchema = forwardAsserts(
			schema.addOverrideDataParserTransformer(overrideTransformer),
			DP.dataParserExtendedKind.has,
		);

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);
		expect(newSchema.definition.overrideDataParserTransformer).toBe(overrideTransformer);

		const newSchemaWithChecker = newSchema.refine(justReturn(true));

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
			(__, { success, dependencyIdentifier }) => {
				type Check = ExpectType<
					typeof __,
					DP.extended.DataParserStringExtended<{
						readonly errorMessage?: string | undefined;
						readonly identifier?: string | undefined;
						readonly overrideTypescriptTransformer?:
							DataParserToTypescript.TransformerBuildFunction | undefined;
						readonly overrideDataParserTransformer?:
							DataParserToDataParser.TransformerBuildFunction | undefined;
						readonly overrideJsonSchemaTransformer?:
							DataParserToJsonSchema.TransformerBuildFunction | undefined;
						readonly coerce: boolean;
						readonly checkers: readonly [];
						readonly mapImportContextEntries?:
							AnyTuple<DataParserToTypescript.MapImportContextEntry> | undefined;
					}>,
					"strict"
				>;

				return success(
					factory.createCallExpression(
						factory.createPropertyAccessExpression(
							dependencyIdentifier,
							factory.createIdentifier("number"),
						),
						undefined,
						[],
					),
				);
			},
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
