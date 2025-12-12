import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("optional", () => {
	it("mode in and out", () => {
		const schema = DPE.optional(DPE.number(), { coalescingValue: 7 });

		expect(
			render(
				schema,
				{
					identifier: "OptionalIn",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "OptionalOut",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
