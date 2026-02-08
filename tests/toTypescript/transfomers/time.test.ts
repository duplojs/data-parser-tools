import { DPE } from "@duplojs/utils";
import { defaultTransformers, type MapImportType, render } from "@scripts/toTypescript";

describe("time", () => {
	it("mode out", () => {
		expect(
			render(
				DPE.time(),
				{
					identifier: "Time",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.time().addIdentifier("TimeIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "TimeIdentifier",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("mode in", () => {
		expect(
			render(
				DPE.time(),
				{
					identifier: "Time",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		const schema = DPE.time().addIdentifier("TimeIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "TimeIdentifier",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();
	});

	it("with preset importType", () => {
		const importType: MapImportType = new Map();
		importType.set("@duplojs/utils/date", ["TheTime"]);

		expect(
			render(
				DPE.time(),
				{
					identifier: "Time",
					transformers: defaultTransformers,
					mode: "in",
					importType,
				},
			),
		).toMatchSnapshot();
	});
});
