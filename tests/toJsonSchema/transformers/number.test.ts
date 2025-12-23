import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DP, DPE } from "@duplojs/utils";

describe("number", () => {
	it("supports int and bounds", () => {
		const schema = DPE.number()
			.addChecker(DP.checkerInt())
			.addChecker(DP.checkerNumberMax(10));

		expect(
			render(
				schema,
				{
					identifier: "NumberSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("coerce on input", () => {
		expect(
			render(
				DPE.number({ coerce: true }).addChecker(DP.checkerNumberMin(1)),
				{
					identifier: "NumberSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("ignores unknown checker", () => {
		const schema = DPE.number();

		// @ts-expect-error cover default branch for unknown checker
		schema.definition.checkers.push({ kind: "unknown-checker" });

		expect(
			render(
				schema,
				{
					identifier: "NumberSchemaUnknown",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
