import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("nil", () => {
	it("renders null type", () => {
		expect(
			render(
				DPE.nil(),
				{
					identifier: "NilSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
