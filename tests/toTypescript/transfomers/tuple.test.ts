import { render, defaultTransformers, DataParserToTypescriptRenderError } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("tuple", () => {
	it("with and without rest", () => {
		expect(
			render(
				DPE.tuple([DPE.string()], { rest: DPE.number() }),
				{
					identifier: "TupleRest",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.tuple([DPE.string(), DPE.boolean()]),
				{
					identifier: "Tuple",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("throws on unsupported inner", () => {
		expect(() => render(
			DPE.tuple([DPE.date()]),
			{
				identifier: "TupleError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrow(DataParserToTypescriptRenderError);
	});

	it("throws on unsupported rest", () => {
		expect(() => render(
			DPE.tuple([DPE.string()], { rest: DPE.date() }),
			{
				identifier: "TupleRestError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrow(DataParserToTypescriptRenderError);
	});
});
