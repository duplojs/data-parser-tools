import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "LazyParser",
	transformers: tsDefaultTransformers,
};

describe("lazy", () => {
	it("renders lazy parser", () => {
		expect(
			render(
				DPE.lazy(() => DPE.string()),
				{
					constName: "lazyParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when lazy inner parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.lazy(() => DPE.string()),
				{
					constName: "lazyParserError",
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

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.lazy(() => DPE.string(), {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "lazyParserCheckerError",
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
