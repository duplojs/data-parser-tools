import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "OptionalParser",
	transformers: tsDefaultTransformers,
};

describe("optional", () => {
	it("renders optional parser", () => {
		expect(
			render(
				DPE.optional(DPE.string()),
				{
					constName: "optionalParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when inner parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.optional(DPE.string()),
				{
					constName: "optionalParserError",
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
		const schema = DPE.optional(DPE.string(), {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "optionalParserCheckerError",
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
