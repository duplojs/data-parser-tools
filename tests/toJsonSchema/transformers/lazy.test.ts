import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("lazy", () => {
	it("unwraps inner schema", () => {
		const schema = DPE.lazy(() => DPE.string());

		expect(
			render(
				schema,
				{
					identifier: "LazySchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
