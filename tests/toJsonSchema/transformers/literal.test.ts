import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DP, DPE } from "@duplojs/utils";

describe("literal", () => {
	it("single literal uses const", () => {
		expect(
			render(
				DPE.literal("value"),
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("array of literals builds anyOf and handles undefined", () => {
		expect(
			render(
				DPE.literal(["a", 2, 2.5, true, null, 10n, undefined]),
				{
					identifier: "LiteralSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
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
