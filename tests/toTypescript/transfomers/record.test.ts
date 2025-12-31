import { render, defaultTransformers, DataParserToTypescriptRenderError } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("record", () => {
	it("handles free and required keys", () => {
		expect(
			render(
				DPE.record(DPE.string(), DPE.number()),
				{
					identifier: "RecordFree",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				DPE.record(DPE.literal(["foo", "bar"]), DPE.boolean()),
				{
					identifier: "RecordRequired",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("throws when key type unsupported", () => {
		expect(() => render(
			DPE.record({ definition: {} } as never, DPE.string()),
			{
				identifier: "RecordError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrow(DataParserToTypescriptRenderError);
	});

	it("throws when value type unsupported", () => {
		expect(() => render(
			DPE.record(DPE.string(), { definition: {} } as never),
			{
				identifier: "RecordValueError",
				transformers: defaultTransformers,
				mode: "out",
			},
		)).toThrow(DataParserToTypescriptRenderError);
	});
});
