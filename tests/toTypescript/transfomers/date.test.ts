import { DPE } from "@duplojs/utils";
import { defaultTransformers, type MapImportType, render } from "@scripts/toTypescript";

describe("date", () => {
	it("mode out", () => {
		expect(
			render(
				DPE.date(),
				{
					identifier: "Date",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.date().addIdentifier("DateIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "DateIdentifier",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("mode in", () => {
		expect(
			render(
				DPE.date(),
				{
					identifier: "Date",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.date().addIdentifier("DateIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "DateIdentifier",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();
	});

	it("with preset importType", () => {
		const importType: MapImportType = new Map();
		importType.set("@duplojs/utils/date", ["TheDate"]);

		expect(
			render(
				DPE.date(),
				{
					identifier: "Date",
					transformers: defaultTransformers,
					mode: "in",
					importType,
				},
			),
		).toMatchSnapshot();
	});
});
