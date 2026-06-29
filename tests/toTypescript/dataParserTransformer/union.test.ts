import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("union", () => {
	it("multiple and single options", () => {
		expect(
			render(
				DPE.union([DPE.string(), DPE.nil(), DPE.empty()]),
				{
					identifier: "UnionMulti",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.union([DPE.string()]),
				{
					identifier: "UnionSingle",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
