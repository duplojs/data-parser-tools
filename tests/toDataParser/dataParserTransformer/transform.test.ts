
import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("transform", () => {
	it("renders transform parser", () => {
		expect(
			render(
				DPE.transform(DPE.string(), (value) => value.trim()),
				{
					identifier: "transformParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when inner parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.transform(DPE.string(), (value) => value.trim()),
				{
					identifier: "transformParserInnerError",
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

	it("fails on native functions", () => {
		expect(
			() => render(
				DPE.transform(DPE.string(), Math.max as any),
				{
					identifier: "transformParserNativeError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});

	it("fails on malformed functions", () => {
		const schema = DPE.transform(DPE.string(), { toString: () => "foo" } as any);
		expect(
			() => render(
				schema,
				{
					identifier: "transformParserMalformedError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});

	it("fails when the function source cannot be parsed as an expression", () => {
		const schema = DPE.transform(DPE.string(), { toString: () => "" } as any);

		expect(
			() => render(
				schema,
				{
					identifier: "transformParserEmptySourceError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});

	it("fails when the parsed statement is not an expression statement", () => {
		expect(
			() => render(
				DPE.transform(DPE.string(), undefined as never),
				{
					identifier: "transformParserStatementError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.transform(DPE.string(), (value) => value.trim(), {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					identifier: "transformParserCheckerError",
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
