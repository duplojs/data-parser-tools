import "@scripts/toTypescript/override";
import { asserts, DP, DPE, forwardAsserts, justReturn } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { type TransformerBuildFunction } from "@scripts/toTypescript/dataParserTransformer";
import { defaultCheckerRefiners, defaultTransformers, render } from "@scripts/toTypescript";
import { type CheckerRefinerBuildFunction } from "@scripts/toTypescript/checkerRefiner";

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

		schema.setOverrideTypescriptTransformer(null);

		expect(schema.definition.overrideTypescriptTransformer).toBe(undefined);
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

	it("setMapImportContextEntries", () => {
		const schema = DP.string();

		schema.setMapImportContextEntries(
			[
				"module-a",
				{
					direct: ["directValue"],
					default: ["defaultValue"],
					namespace: ["NamespaceValue"],
				},
			],
			[
				"module-b",
				{
					direct: undefined,
					default: undefined,
					namespace: undefined,
				},
			],
		);

		expect(schema.definition.mapImportContextEntries).toEqual([
			[
				"module-a",
				{
					direct: ["directValue"],
					default: ["defaultValue"],
					namespace: ["NamespaceValue"],
				},
			],
			[
				"module-b",
				{
					direct: undefined,
					default: undefined,
					namespace: undefined,
				},
			],
		]);
	});

	it("addMapImportContextEntries", () => {
		const schema = DP.string();
		const newSchema = schema.addMapImportContextEntries(
			["module-a", { direct: ["directValue"] }],
		);

		expect(schema.definition.mapImportContextEntries).toBe(undefined);
		expect(newSchema.definition.mapImportContextEntries).toEqual([["module-a", { direct: ["directValue"] }]]);
	});

	it("uses static override and map imports in render", () => {
		const schema = DP.string()
			.addOverrideTypescriptTransformer(factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword))
			.addMapImportContextEntries(
				[
					"module-a",
					{
						direct: ["directValue"],
						default: ["defaultValue"],
						namespace: ["NamespaceValue"],
					},
				],
				[
					"module-b",
					{
						direct: undefined,
						default: undefined,
						namespace: undefined,
					},
				],
			);

		const result = render(
			schema,
			{
				identifier: "OverrideWithImports",
				transformers: defaultTransformers,
				mode: "out",
			},
		);

		expect(result).toContain("import * as NamespaceValue from \"module-a\";");
		expect(result).toContain("import defaultValue from \"module-a\";");
		expect(result).toContain("import { directValue } from \"module-a\";");
		expect(result).toContain("export type OverrideWithImports = boolean;");
	});

	it("sets checker override refiner and map imports", () => {
		const checker = DP.checkerStringMin(1);

		checker.setOverrideTypescriptRefiner(factory.createTypeReferenceNode("StaticRefinement"));
		checker.setMapImportContextEntries(["module-c", { direct: ["CheckerImport"] }]);

		expect(typeof checker.definition.overrideTypescriptRefiner).toBe("function");
		expect(checker.definition.mapImportContextEntries).toEqual([["module-c", { direct: ["CheckerImport"] }]]);

		checker.setOverrideTypescriptRefiner(null);

		expect(checker.definition.overrideTypescriptRefiner).toBe(undefined);
	});

	it("adds checker override refiner and map imports", () => {
		const checker = DP.checkerStringMin(1);
		const overrideRefiner: CheckerRefinerBuildFunction = (
			__,
			___,
			{ success },
		) => success(factory.createTypeReferenceNode("AddedRefinement"));
		const newChecker = checker
			.addOverrideTypescriptRefiner(overrideRefiner)
			.addMapImportContextEntries(["module-c", { direct: ["CheckerImport"] }]);

		expect(checker.definition.overrideTypescriptRefiner).toBe(undefined);
		expect(checker.definition.mapImportContextEntries).toBe(undefined);
		expect(newChecker.definition.overrideTypescriptRefiner).toBe(overrideRefiner);
		expect(newChecker.definition.mapImportContextEntries).toEqual([["module-c", { direct: ["CheckerImport"] }]]);
	});

	it("uses checker override refiner in render", () => {
		const schema = DP.string({
			checkers: [
				DP.checkerStringMin(1)
					.addOverrideTypescriptRefiner(factory.createTypeReferenceNode("StaticRefinement"))
					.addMapImportContextEntries(["module-c", { direct: ["CheckerImport"] }]),
			],
		});

		expect(
			render(
				schema,
				{
					identifier: "CheckerOverride",
					transformers: defaultTransformers,
					checkerRefiner: defaultCheckerRefiners,
					mode: "out",
				},
			),
		).toContain("StaticRefinement");
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
