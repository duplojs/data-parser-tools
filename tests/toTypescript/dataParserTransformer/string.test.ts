import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("string", () => {
	it("basic", () => {
		const schema = DPE.string();

		expect(
			render(
				schema,
				{
					identifier: "Test",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
