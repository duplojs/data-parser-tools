import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("templateLiteral", () => {
	it("builds pattern", () => {
		expect(
			render(
				DPE.templateLiteral(["id-", DPE.number(), "-ok"]),
				{
					identifier: "TemplateSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("covers bigint null and undefined segments", () => {
		expect(
			render(
				DPE.templateLiteral([10n, "-", null, "-", undefined, "-", true]),
				{
					identifier: "TemplateSchemaExtended",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
