import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("optional", () => {
	it("out mode keeps required inner when isOptional false", () => {
		expect(
			render(
				DPE.optional(DPE.string(), { coalescingValue: "test" }),
				{
					identifier: "OptionalSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("in mode marks undefined", () => {
		expect(
			render(
				DPE.optional(DPE.string()),
				{
					identifier: "OptionalSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
