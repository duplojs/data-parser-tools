import { DPE } from "@duplojs/utils";
import { defaultTransformers, type MapImportContext, render } from "@scripts/toTypescript";

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
		const importContext: MapImportContext = new Map();
		importContext.set("@duplojs/utils/date", { direct: ["TheTime"] });

		expect(
			render(
				DPE.time(),
				{
					identifier: "Time",
					transformers: defaultTransformers,
					mode: "in",
					importContext,
				},
			),
		).toMatchSnapshot();
	});
});
