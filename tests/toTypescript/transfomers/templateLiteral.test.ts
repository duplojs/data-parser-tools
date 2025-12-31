import { render, defaultTransformers, DataParserToTypescriptRenderError, templateLiteralTransformer } from "@scripts/toTypescript";
import { DP, DPE, E } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";

describe("templateLiteral", () => {
	it("renders combinations", () => {
		expect(
			render(
				DPE.templateLiteral(["user-", DPE.number(), "-id"]),
				{
					identifier: "TemplateWithHead",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.templateLiteral([DPE.number(), "-items"]),
				{
					identifier: "TemplateWithDataHead",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.templateLiteral(["id-", 10n, "-", true]),
				{
					identifier: "TemplateWithBigint",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.templateLiteral([DPE.string(), DPE.number(), DPE.boolean(), "-end"]),
				{
					identifier: "TemplateWithParsers",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.templateLiteral(["pre-", DPE.string(), "-mid-", DPE.number(), "-suf"]),
				{
					identifier: "TemplateMultiSpan",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("throws on unsupported member", () => {
		expect(() => render(
			DPE.templateLiteral([
				DP.dataParserKind.addTo(
					{ definition: {} } as never,
					null as never,
				),
			]),
			{
				identifier: "TemplateError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrow(DataParserToTypescriptRenderError);
	});

	it("returns buildError when members are invalid", () => {
		const schema = DPE.templateLiteral([DPE.string(), DPE.number(), DPE.boolean()]);

		const result = templateLiteralTransformer(
			schema,
			{
				transformer: () => E.right("buildSuccess", "not-a-type-node" as any),
				success: (value) => E.right("buildSuccess", value),
				buildError: () => E.left("buildDataParserError"),
				mode: "out",
				context: new Map(),
			},
		);

		expect(E.isLeft(result)).toBe(true);
	});

	it("creates spans with middle and tail", () => {
		const schema = DPE.templateLiteral([DPE.string(), DPE.number(), DPE.boolean()]);

		const result = templateLiteralTransformer(
			schema,
			{
				transformer: () => E.right(
					"buildSuccess",
					factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
				),
				success: (value) => E.right("buildSuccess", value),
				buildError: () => E.left("buildDataParserError"),
				mode: "out",
				context: new Map(),
			},
		);

		expect(E.isRight(result)).toBe(true);
	});

	it("void", () => {
		expect(
			render(
				DPE.templateLiteral([] as never),
				{
					identifier: "Void",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
