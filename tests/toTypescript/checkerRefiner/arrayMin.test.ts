import { render, defaultTransformers, defaultCheckerRefiners, DataParserToTypescriptRenderError } from "@scripts/toTypescript";
import { DP, DPE } from "@duplojs/utils";

describe("array min", () => {
	it("string array", () => {
		expect(
			render(
				DPE.array(DPE.string()).addChecker(DP.checkerArrayMin(3)),
				{
					identifier: "ArrayString",
					transformers: defaultTransformers,
					checkerRefiner: defaultCheckerRefiners,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("current type node is not array", () => {
		expect(
			() => render(
				DPE.string().addChecker(DP.checkerArrayMin(3) as never),
				{
					identifier: "ArrayString",
					transformers: defaultTransformers,
					checkerRefiner: defaultCheckerRefiners,
					mode: "out",
				},
			),
		).toThrow(DataParserToTypescriptRenderError);
	});
});
