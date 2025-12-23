import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("bigint", () => {
	it("basic", () => {
		expect(
			render(
				DPE.bigint(),
				{
					identifier: "BigintSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("coerce on input", () => {
		expect(
			render(
				DPE.bigint({ coerce: true }),
				{
					identifier: "BigintSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
