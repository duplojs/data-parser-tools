import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("recover", () => {
	it("keeps inner for input and recovered for output", () => {
		const schema = DPE.recover(DPE.string(), { message: "ko" });

		expect(
			render(
				schema,
				{
					identifier: "RecoverIn",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "RecoverOut",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
