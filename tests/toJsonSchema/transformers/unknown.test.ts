import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("unknown", () => {
	it("renders empty schema", () => {
		expect(
			render(
				DPE.unknown(),
				{
					identifier: "UnknownSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
