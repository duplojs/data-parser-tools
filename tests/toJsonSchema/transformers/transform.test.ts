import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("transform", () => {
	it("in mode uses inner", () => {
		expect(
			render(
				DPE.transform(DPE.string(), (value) => value),
				{
					identifier: "TransformSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("out mode becomes unknown", () => {
		expect(
			render(
				DPE.transform(DPE.string(), (value) => value),
				{
					identifier: "TransformSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
