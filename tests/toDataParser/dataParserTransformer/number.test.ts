import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("number", () => {
	it("renders number parser", () => {
		expect(
			render(
				DPE.number({ coerce: true }),
				{
					identifier: "numberParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders number parser without coerce", () => {
		expect(
			render(
				DPE.number(),
				{
					identifier: "numberParserNoCoerce",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders number parser with definition checkers", () => {
		expect(
			render(
				DPE.number({
					checkers: [
						DP.checkerNumberMin(1),
						DP.checkerInt(),
					],
				}),
				{
					identifier: "numberParserWithDefinitionCheckers",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders number parser with addChecker", () => {
		expect(
			render(
				DPE.number().addChecker(
					DP.checkerNumberMax(10),
				),
				{
					identifier: "numberParserWithAddChecker",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.number({
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					identifier: "numberParserError",
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
