import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("boolean", () => {
	it("basic", () => {
		expect(
			render(
				DPE.boolean(),
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
