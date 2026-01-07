import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("time", () => {
	it("renders out mode pattern", () => {
		const schema = DPE.time({ coerce: true });

		expect(
			render(
				schema,
				{
					identifier: "TimeSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("allows coercion on input", () => {
		const schema = DPE.time({ coerce: true });

		expect(
			render(
				schema,
				{
					identifier: "TimeSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
