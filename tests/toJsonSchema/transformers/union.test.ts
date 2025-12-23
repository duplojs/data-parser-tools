import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("union", () => {
	it("merges schemas and propagates canBeUndefined", () => {
		expect(
			render(
				DPE.union([DPE.string(), DPE.optional(DPE.number())]),
				{
					identifier: "UnionSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
