import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DP, DPE } from "@duplojs/utils";

describe("literal", () => {
	it("single literal uses const", () => {
		const schema = DPE.literal("value");
		expect(
			render(
				schema,
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
		expect(
			render(
				schema,
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "jsonSchema4",
				},
			),
		).toMatchSnapshot();
	});

	it("array of literals builds anyOf and handles undefined", () => {
		const schema = DPE.literal(["a", 2, 2.5, true, null, 10n, undefined]);
		expect(
			render(
				schema,
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
		expect(
			render(
				schema,
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "jsonSchema4",
				},
			),
		).toMatchSnapshot();
		expect(
			render(
				schema,
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "openApi3",
				},
			),
		).toMatchSnapshot();
	});

	it("ignores unsupported literal values", () => {
		expect(
			render(
				// @ts-expect-error simulate unexpected literal content
				DPE.literal([Symbol("x"), { foo: "bar" }]),
				{
					identifier: "LiteralSchemaUnsupported",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("handles only-undefined literal", () => {
		expect(
			render(
				DPE.literal([undefined]),
				{
					identifier: "LiteralSchemaOnlyUndefined",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
