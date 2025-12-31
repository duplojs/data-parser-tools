import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toTypescript";

describe("date", () => {
	it("string array", () => {
		expect(
			render(
				DPE.date(),
				{
					identifier: "Date",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.date().addIdentifier("DateIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "DateIdentifier",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
