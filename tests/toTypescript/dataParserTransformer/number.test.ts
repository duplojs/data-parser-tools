import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("number", () => {
	it("basic", () => {
		expect(
			render(
				DPE.number(),
				{
					identifier: "Number",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
