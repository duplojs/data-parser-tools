import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DP, DPE } from "@duplojs/utils";

describe("string", () => {
	it("applies string checkers", () => {
		const schema = DPE.string()
			.addChecker(DP.checkerStringMin(2))
			.addChecker(DP.checkerStringRegex(/^[a-z]+$/));

		expect(
			render(
				schema,
				{
					identifier: "StringSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("coerce on input", () => {
		expect(
			render(
				DPE.string({ coerce: true }),
				{
					identifier: "StringSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("handles url and max", () => {
		expect(
			render(
				DPE.string()
					.addChecker(DP.checkerStringMax(10))
					.addChecker(DP.checkerUrl()),
				{
					identifier: "StringUrlSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("handles email and ignores unknown checker", () => {
		const schema = DPE.string()
			.addChecker(DP.checkerEmail());

		// @ts-expect-error force an unknown checker to cover default branch
		schema.definition.checkers.push({ kind: "unknown-checker" });

		expect(
			render(
				schema,
				{
					identifier: "StringEmailSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
