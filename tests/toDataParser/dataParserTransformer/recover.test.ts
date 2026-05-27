import { render, defaultTransformers, defaultCheckerTransformers } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("recover", () => {
	it("renders inner parser", () => {
		expect(
			render(
				DPE.recover(DPE.string(), "fallback"),
				{
					identifier: "recoverParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});
});
