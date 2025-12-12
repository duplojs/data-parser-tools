import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("lazy", () => {
	it("unwraps inner schema", () => {
		const schema = DPE.lazy(() => DPE.literal(["lazy"]));

		expect(
			render(
				schema,
				{
					identifier: "Lazy",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
