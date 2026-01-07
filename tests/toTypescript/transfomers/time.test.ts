import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toTypescript";

describe("time", () => {
	it("string array", () => {
		expect(
			render(
				DPE.time(),
				{
					identifier: "Time",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.time().addIdentifier("TimeIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "TimeIdentifier",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
