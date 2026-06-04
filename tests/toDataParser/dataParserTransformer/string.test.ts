import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("string", () => {
	it("renders string parser", () => {
		expect(
			render(
				DPE.string(),
				{
					identifier: "stringParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders string parser with definition checkers", () => {
		expect(
			render(
				DPE.string({
					checkers: [
						DP.checkerStringMin(3),
						DP.checkerStringMax(10),
					],
				}),
				{
					identifier: "stringParserWithDefinitionCheckers",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders string parser with addChecker", () => {
		expect(
			render(
				DPE.string().addChecker(
					DP.checkerRegex(/^[a-z]+$/),
				),
				{
					identifier: "stringParserWithAddChecker",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders string parser when definition has a checker error", () => {
		const schema = DPE.string({
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					identifier: "stringParserError",
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
