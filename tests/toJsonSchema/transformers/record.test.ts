import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("record", () => {
	it("with requireKey enforces exact keys", () => {
		const schema = DPE.record(DPE.literal(["a", "b"]), DPE.number());

		expect(
			render(
				schema,
				{
					identifier: "RecordSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("without requireKey keeps propertyNames/additionalProperties", () => {
		const schema = DPE.record(DPE.string(), DPE.number(), { requireKey: null });

		expect(
			render(
				schema,
				{
					identifier: "RecordSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
