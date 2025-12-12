import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("transform", () => {
	it("mode in uses inner, mode out unknown", () => {
		const schema = DPE.transform(DPE.number(), (value) => String(value));

		expect(
			render(
				schema,
				{
					identifier: "TransformIn",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "TransformOut",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
