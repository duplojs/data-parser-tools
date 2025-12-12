import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("array", () => {
	it("string array", () => {
		expect(
			render(
				DPE.array(DPE.string()),
				{
					identifier: "ArrayString",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.array(DPE.string()).addIdentifier("Numbers");

		expect(
			render(
				schema,
				{
					identifier: "ArrayNumber",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
