import { render, defaultTransformers } from "@scripts/toTypescript";
import { DP, DPE, E } from "@duplojs/utils";

describe("errorHandler", () => {
	it("renders inner parser type in mode in and out", () => {
		const inner = DPE.string();
		const schema = DPE.errorHandler(
			inner,
			DP.createErrorMessageTransformer(DP.stringKind, () => "Expected string."),
		);
		const inputParams = {
			identifier: "ErrorHandlerIn",
			transformers: defaultTransformers,
			mode: "in" as const,
		};
		const outputParams = {
			identifier: "ErrorHandlerOut",
			transformers: defaultTransformers,
			mode: "out" as const,
		};
		const inputResult = render(schema, inputParams);
		const outputResult = render(schema, outputParams);

		expect(inputResult).toMatchSnapshot();
		expect(inputResult).toBe(render(inner, inputParams));
		expect(outputResult).toMatchSnapshot();
		expect(outputResult).toBe(render(inner, outputParams));
	});

	it("fails when inner parser cannot be rendered", () => {
		expect(
			() => render(
				DPE.errorHandler(
					DPE.string(),
					DP.createErrorMessageTransformer(DP.stringKind, () => "Expected string."),
				),
				{
					identifier: "ErrorHandlerError",
					transformers: [
						((dataParser, { buildError }) => DP.stringKind.has(dataParser)
							? buildError()
							: E.left("dataParserNotSupport", dataParser)),
						...defaultTransformers,
					],
					mode: "out",
				},
			),
		).toThrow();
	});
});
