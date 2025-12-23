import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("empty", () => {
	it("out mode", () => {
		expect(
			render(
				DPE.empty(),
				{
					identifier: "EmptySchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("coerce on input", () => {
		expect(
			render(
				DPE.empty({ coerce: true }),
				{
					identifier: "EmptySchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
