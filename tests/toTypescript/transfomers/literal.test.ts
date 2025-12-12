import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("literal", () => {
	it("union of literals", () => {
		const schema = DPE.literal(["foo", 1, true, 10n, undefined, false, null]);

		expect(
			render(
				schema,
				{
					identifier: "LiteralUnion",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
