import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toJsonSchema";

describe("override json schema", () => {
	it("simple change", () => {
		expect(
			render(
				DPE.boolean().addOverrideJsonSchema({
					schema: {
						type: "string",
						format: "email",
					},
					isOptional: true,
				}),
				{
					identifier: "BooleanSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("mode in", () => {
		const schema = DPE.boolean().addOverrideJsonSchema({
			in: {
				isOptional: false,
				schema: {
					type: "string",
					minLength: 1,
				},
			},
		});

		expect(
			render(
				schema,
				{
					identifier: "BooleanSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "BooleanSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("out", () => {
		const schema = DPE.object({
			value: DPE.boolean().addOverrideJsonSchema({
				out: {
					isOptional: false,
					schema: {
						type: "integer",
					},
				},
			}),
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

		expect(
			render(
				schema,
				{
					identifier: "ObjectSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
