import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DP, DPE } from "@duplojs/utils";

describe("array", () => {
	it("renders items and constraints", () => {
		const schema = DPE.array(DPE.string()).addChecker(DP.checkerArrayMin(1));

		expect(
			render(
				schema,
				{
					identifier: "ArraySchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("renders max constraint", () => {
		const schema = DPE.array(DPE.string()).addChecker(DP.checkerArrayMax(2));

		expect(
			render(
				schema,
				{
					identifier: "ArraySchemaMax",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("ignores unknown checker", () => {
		const schema = DPE.array(DPE.string());
		// @ts-expect-error cover default branch for unknown checker
		schema.definition.checkers.push({ kind: "unknown-checker" });

		expect(
			render(
				schema,
				{
					identifier: "ArraySchemaUnknown",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
