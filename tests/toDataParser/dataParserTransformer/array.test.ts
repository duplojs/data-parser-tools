import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("array", () => {
	it("renders array parser", () => {
		expect(
			render(
				DPE.array(DPE.string()),
				{
					identifier: "arrayParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders array parser with definition checkers", () => {
		expect(
			render(
				DPE.array(DPE.string(), {
					checkers: [
						DP.checkerArrayMin(1),
						DP.checkerArrayMax(3),
					],
				}),
				{
					identifier: "arrayParserWithDefinitionCheckers",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders array parser with addChecker", () => {
		expect(
			render(
				DPE.array(DPE.string()).addChecker(
					DP.checkerArrayMin(1),
				),
				{
					identifier: "arrayParserWithAddChecker",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when inner element cannot be rendered", () => {
		expect(
			() => render(
				DPE.array(DPE.string()),
				{
					identifier: "arrayParserError",
					dataParserTransformers: [
						((dataParser, { buildError }) => DP.stringKind.has(dataParser)
							? buildError()
							: E.left("dataParserNotSupport", dataParser)),
						...defaultTransformers,
					],
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.array(DPE.string(), {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					identifier: "arrayParserCheckerError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: [
						((checker, { buildError }) => (checker as any).kind === "forced-error"
							? buildError()
							: E.left("checkerNotSupport", checker)),
					],
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});
});
