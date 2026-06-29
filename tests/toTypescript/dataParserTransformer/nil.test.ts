import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("nil", () => {
	it("basic", () => {
		expect(
			render(
				DPE.nil(),
				{
					identifier: "Nil",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
