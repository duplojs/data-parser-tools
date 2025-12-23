import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("object", () => {
	it("marks optional properties with undefined support", () => {
		const schema = DPE.object({
			required: DPE.string(),
			optional: DPE.optional(DPE.number()),
			nullable: DPE.nullable(DPE.string()),
		});

		expect(
			render(
				schema,
				{
					identifier: "ObjectSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("drops optional properties from required list in input mode", () => {
		const schema = DPE.object({
			required: DPE.string(),
			optional: DPE.optional(DPE.number()),
			nullable: DPE.nullable(DPE.string()),
		});

		expect(
			render(
				schema,
				{
					identifier: "ObjectSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("omits required field when every property is optional", () => {
		expect(
			render(
				DPE.object({
					foo: DPE.optional(DPE.string()),
				}),
				{
					identifier: "ObjectOptionalSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
