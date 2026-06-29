import { render, defaultTransformers, defaultCheckerRefiners } from "@scripts/toTypescript";
import { DP, DPE } from "@duplojs/utils";

describe("array max", () => {
	it("string array", () => {
		expect(
			render(
				DPE.array(DPE.string()).addChecker(DP.checkerArrayMax(10)),
				{
					identifier: "ArrayString",
					transformers: defaultTransformers,
					checkerRefiner: defaultCheckerRefiners,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
