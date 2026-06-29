import { render, defaultTransformers, defaultCheckerRefiners } from "@scripts/toTypescript";
import { DP, DPE, E } from "@duplojs/utils";

describe("string email", () => {
	it("basic", () => {
		const schema = DPE.email();

		expect(
			render(
				schema,
				{
					identifier: "Test",
					transformers: defaultTransformers,
					checkerRefiner: defaultCheckerRefiners,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("keeps base type when checker refiner does not support checker", () => {
		expect(
			render(
				DPE.string({
					checkers: [DP.checkerEmail()],
				}),
				{
					identifier: "UnsupportedEmailRefiner",
					transformers: defaultTransformers,
					checkerRefiner: [(checker) => E.left("checkerNotSupport", checker)],
					mode: "out",
				},
			),
		).toBe("export type UnsupportedEmailRefiner = string;");
	});
});
