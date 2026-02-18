import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toJsonSchema";

describe("override json schema", () => {
	it("simple change", () => {
		expect(
			render(
				DPE.boolean().addOverrideJsonSchemaTransformer({
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
		const schema = DPE.boolean().addOverrideJsonSchemaTransformer(
			(dataParser, { success, mode, transformer }) => mode === "in"
				? success(
					{
						type: "string",
						minLength: 1,
					},
					false,
				)
				: transformer(dataParser),
		);

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
			value: DPE.boolean().addOverrideJsonSchemaTransformer(
				(dataParser, { success, mode, transformer }) => mode === "out"
					? success(
						{
							type: "integer",
						},
						false,
					)
					: transformer(dataParser),
			),
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
