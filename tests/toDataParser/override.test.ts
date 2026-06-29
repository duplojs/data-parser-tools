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

		schema.setOverrideDataParserTransformer(null);

		expect(schema.definition.overrideDataParserTransformer).toBe(undefined);
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

	it("uses static overrideDataParserTransformer in render", () => {
		const schema = DPE.string().addOverrideDataParserTransformer(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					factory.createIdentifier("DP"),
					factory.createIdentifier("number"),
				),
				undefined,
				[],
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

	it("sets checker override transformer", () => {
		const checker = DP.checkerStringMin(1);

		checker.setOverrideCheckerTransformer(factory.createIdentifier("customChecker"));

		expect(typeof checker.definition.overrideCheckerTransformer).toBe("function");

		checker.setOverrideCheckerTransformer(null);

		expect(checker.definition.overrideCheckerTransformer).toBe(undefined);
	});

	it("adds checker override transformer", () => {
		const checker = DP.checkerStringMin(1);
		const overrideTransformer: DataParserToDataParser.CheckerTransformerBuildFunction = (
			__,
			{ success },
		) => success(factory.createIdentifier("customChecker"));
		const newChecker = checker.addOverrideCheckerTransformer(overrideTransformer);

		expect(checker.definition.overrideCheckerTransformer).toBe(undefined);
		expect(newChecker.definition.overrideCheckerTransformer).toBe(overrideTransformer);
	});

	it("uses static checker override transformer in render", () => {
		const schema = DPE.string({
			checkers: [DP.checkerStringMin(1).addOverrideCheckerTransformer(factory.createIdentifier("customChecker"))],
		});

		const result = render(
			schema,
			{
				identifier: "overrideChecker",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
			},
		);

		expect(result).toContain("checkers: [customChecker]");
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

	it("uses map imports in render", () => {
		const schema = DPE.string()
			.addMapImportContextEntries([
				"module-a",
				{
					direct: ["directValue"],
					default: ["defaultValue"],
					namespace: ["NamespaceValue"],
				},
			]);

		const result = render(
			schema,
			{
				identifier: "withImport",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
			},
		);

		expect(result).toContain("import * as NamespaceValue from \"module-a\";");
		expect(result).toContain("import defaultValue from \"module-a\";");
		expect(result).toContain("import { directValue } from \"module-a\";");
	});
});
