import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("bigint", () => {
	it("basic", () => {
		expect(
			render(
				DPE.bigint(),
				{
					identifier: "Bigint",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
