import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "TupleParser",
	transformers: tsDefaultTransformers,
};

describe("tuple", () => {
	it("renders tuple parser with rest", () => {
		expect(
			render(
				DPE.tuple([DPE.string()], { rest: DPE.number() }),
				{
					constName: "tupleParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("renders tuple parser without rest", () => {
		expect(
			render(
				DPE.tuple([DPE.string()]),
				{
					constName: "tupleParserNoRest",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when tuple shape cannot be rendered", () => {
		expect(
			() => render(
				DPE.tuple([DPE.string()], { rest: DPE.number() }),
				{
					constName: "tupleParserShapeError",
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

	it("fails when tuple rest cannot be rendered", () => {
		expect(
			() => render(
				DPE.tuple([DPE.string()], { rest: DPE.number() }),
				{
					constName: "tupleParserRestError",
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
		const schema = DPE.tuple([DPE.string()], {
			rest: DPE.number(),
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "tupleParserCheckerError",
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
