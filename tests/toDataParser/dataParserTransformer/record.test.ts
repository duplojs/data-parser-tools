import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "RecordParser",
	transformers: tsDefaultTransformers,
};

describe("record", () => {
	it("renders record parser", () => {
		expect(
			render(
				DPE.record(DPE.string(), DPE.number()),
				{
					constName: "recordParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when key parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.record(DPE.string(), DPE.number()),
				{
					constName: "recordParserKeyError",
					dataParserTransformers: [
						((dataParser, { buildError }) => DP.stringKind.has(dataParser)
							? buildError()
							: E.left("dataParserNotSupport", dataParser)),
						...defaultTransformers,
					],
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toThrow();
	});

	it("fails when value parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.record(DPE.string(), DPE.number()),
				{
					constName: "recordParserValueError",
					dataParserTransformers: [
						((dataParser, { buildError }) => DP.numberKind.has(dataParser)
							? buildError()
							: E.left("dataParserNotSupport", dataParser)),
						...defaultTransformers,
					],
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toThrow();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.record(
			DPE.string(),
			DPE.number(),
			{
				checkers: [{ kind: "forced-error" } as any],
			},
		);

		expect(
			() => render(
				schema,
				{
					constName: "recordParserCheckerError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: [
						((checker, { buildError }) => (checker as any).kind === "forced-error"
							? buildError()
							: E.left("checkerNotSupport", checker)),
					],
					toTypescript,
				},
			),
		).toThrow();
	});
});
