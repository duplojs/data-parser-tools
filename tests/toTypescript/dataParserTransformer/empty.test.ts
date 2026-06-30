import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("empty", () => {
	it("basic", () => {
		expect(
			render(
				DPE.empty(),
				{
					identifier: "Empty",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
