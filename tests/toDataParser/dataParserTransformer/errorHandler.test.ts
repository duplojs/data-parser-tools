import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("errorHandler", () => {
	it("renders inner parser", () => {
		const inner = DPE.string();
		const schema = DPE.errorHandler(
			inner,
			DP.createErrorMessageTransformer(DP.stringKind, () => "Expected string."),
		);
		const params = {
			identifier: "errorHandlerParser",
			dataParserTransformers: defaultTransformers,
			checkerTransformers: defaultCheckerTransformers,
			typescriptTransformers: tsDefaultTransformers,
		};
		const result = render(schema, params);

		expect(result).toMatchSnapshot();
		expect(result).toBe(render(inner, params));
	});

	it("fails when inner parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.errorHandler(
					DPE.string(),
					DP.createErrorMessageTransformer(DP.stringKind, () => "Expected string."),
				),
				{
					identifier: "errorHandlerParserError",
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
});
