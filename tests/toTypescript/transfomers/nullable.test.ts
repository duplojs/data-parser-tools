import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("nullable", () => {
	it("mode in and out", () => {
		const schema = DPE.nullable(DPE.string(), { coalescingValue: null });

		expect(
			render(
				schema,
				{
					identifier: "NullableIn",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "NullableOut",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("throws when inner transformer fails", () => {
		expect(() => render(
			DPE.nullable(DPE.date()),
			{
				identifier: "NullableError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrowError();
	});
});
