import { render, defaultTransformers, defaultCheckerTransformers } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("recover", () => {
	it("renders inner parser", () => {
		expect(
			render(
				DPE.recover(DPE.string(), "fallback"),
				{
					constName: "recoverParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "RecoverParser",
						transformers: tsDefaultTransformers,
					},
				},
			),
		).toMatchSnapshot();
	});
});
