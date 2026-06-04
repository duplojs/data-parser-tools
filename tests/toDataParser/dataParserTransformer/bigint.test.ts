import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("bigint", () => {
	it("renders bigint parser", () => {
		expect(
			render(
				DPE.bigint({ coerce: true }),
				{
					identifier: "bigintParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders bigint parser without coerce", () => {
		expect(
			render(
				DPE.bigint(),
				{
					identifier: "bigintParserNoCoerce",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders bigint parser with definition checkers", () => {
		expect(
			render(
				DPE.bigint({
					checkers: [
						DP.checkerBigIntMin(1n),
						DP.checkerBigIntMax(10n),
					],
				}),
				{
					identifier: "bigintParserWithDefinitionCheckers",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders bigint parser with addChecker", () => {
		expect(
			render(
				DPE.bigint().addChecker(
					DP.checkerBigIntMin(1n),
				),
				{
					identifier: "bigintParserWithAddChecker",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.bigint({
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					identifier: "bigintParserError",
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
