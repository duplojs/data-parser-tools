import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("nullable", () => {
	it("out mode keeps inner", () => {
		expect(
			render(
				DPE.nullable(DPE.string()),
				{
					identifier: "NullableSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("in mode union with null", () => {
		expect(
			render(
				DPE.nullable(DPE.string()),
				{
					identifier: "NullableSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
