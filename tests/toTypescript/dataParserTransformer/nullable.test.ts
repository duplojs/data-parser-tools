import { render, defaultTransformers } from "@scripts/toTypescript";
import { DP, DPE } from "@duplojs/utils";

describe("nullable", () => {
	it("mode in and out", () => {
		const schema = DPE.nullable(DPE.string(), { coalescingValue: "test" });

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
			DPE.nullable(DP.dataParserKind.addTo(
				{ definition: {} } as never,
				null as never,
			)),
			{
				identifier: "NullableError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrowError();
	});
});
