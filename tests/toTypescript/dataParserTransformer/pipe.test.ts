import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("pipe", () => {
	it("switches schema based on mode", () => {
		const schema = DPE.pipe(DPE.string(), DPE.number());

		expect(
			render(
				schema,
				{
					identifier: "PipeIn",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "PipeOut",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
