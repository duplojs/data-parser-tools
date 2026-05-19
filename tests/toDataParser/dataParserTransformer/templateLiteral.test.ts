import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "TemplateLiteralParser",
	transformers: tsDefaultTransformers,
};

describe("templateLiteral", () => {
	it("renders template literal parser", () => {
		expect(
			render(
				DPE.templateLiteral([
					"pre-",
					1n,
					"mid-",
					true,
					"-false-",
					false,
					"-str-",
					"abc",
					"-num-",
					42,
					"-null-",
					null,
					"-undef-",
					undefined,
					"-dp-",
					DPE.string(),
				]),
				{
					constName: "templateLiteralParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when nested parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.templateLiteral(["user-", DPE.number(), "-id"]),
				{
					constName: "templateLiteralParserError",
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
		const schema = DPE.templateLiteral(["user-", DPE.number(), "-id"], {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "templateLiteralParserCheckerError",
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
