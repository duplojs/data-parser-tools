import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("date", () => {
	it("renders out mode pattern", () => {
		const schema = DPE.date({ coerce: true });

		expect(
			render(
				schema,
				{
					identifier: "DateSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("allows coercion on input", () => {
		const schema = DPE.date({ coerce: true });

		expect(
			render(
				schema,
				{
					identifier: "DateSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
