import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("recover", () => {
	it("in mode produces unknown", () => {
		expect(
			render(
				DPE.recover(DPE.string(), undefined),
				{
					identifier: "RecoverSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("out mode uses inner schema", () => {
		expect(
			render(
				DPE.recover(DPE.string(), undefined),
				{
					identifier: "RecoverSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
