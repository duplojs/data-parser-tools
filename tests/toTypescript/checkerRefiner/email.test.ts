import { render, defaultTransformers, defaultCheckerRefiners } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

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
});
