import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("pipe", () => {
	it("uses input on in mode", () => {
		expect(
			render(
				DPE.pipe(DPE.string(), DPE.number()),
				{
					identifier: "PipeSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("uses output on out mode", () => {
		expect(
			render(
				DPE.pipe(DPE.string(), DPE.number()),
				{
					identifier: "PipeSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
