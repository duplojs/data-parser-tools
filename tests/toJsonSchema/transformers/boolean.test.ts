import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("boolean", () => {
	it("basic", () => {
		expect(
			render(
				DPE.boolean(),
				{
					identifier: "BooleanSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("coerce on input", () => {
		expect(
			render(
				DPE.boolean({ coerce: true }),
				{
					identifier: "BooleanSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
