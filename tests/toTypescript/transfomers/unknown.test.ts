import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("unknown", () => {
	it("basic", () => {
		expect(
			render(
				DPE.unknown(),
				{
					identifier: "Unknown",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
