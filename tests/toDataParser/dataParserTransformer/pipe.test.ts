import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "PipeParser",
	transformers: tsDefaultTransformers,
};

describe("pipe", () => {
	it("renders pipe parser", () => {
		expect(
			render(
				DPE.pipe(DPE.string(), DPE.number()),
				{
					constName: "pipeParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when input parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.pipe(DPE.string(), DPE.number()),
				{
					constName: "pipeParserInputError",
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

	it("fails when output parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.pipe(DPE.string(), DPE.number()),
				{
					constName: "pipeParserOutputError",
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
		const schema = DPE.pipe(DPE.string(), DPE.number(), {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "pipeParserCheckerError",
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
