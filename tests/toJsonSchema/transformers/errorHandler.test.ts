import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { errorHandlerTransformer } from "@scripts/toJsonSchema/transformer/defaults";
import { DP, DPE, E } from "@duplojs/utils";

describe("errorHandler", () => {
	it("renders inner schema", () => {
		const inner = DPE.number();
		const schema = DPE.errorHandler(
			inner,
			DP.createErrorMessageTransformer(DP.numberKind, () => "Expected number."),
		);
		const params = {
			identifier: "ErrorHandlerSchema",
			transformers: defaultTransformers,
			mode: "out" as const,
			version: "jsonSchema7" as const,
		};
		const result = render(schema, params);

		expect(result).toMatchSnapshot();
		expect(result).toStrictEqual(render(inner, params));
	});

	it("returns left when inner transform fails", () => {
		const schema = DPE.errorHandler(
			DPE.string(),
			DP.createErrorMessageTransformer(DP.stringKind, () => "Expected string."),
		);
		expect(errorHandlerTransformer(
			schema,
			{
				mode: "out",
				context: new Map(),
				version: "jsonSchema7",
				transformer: () => E.left("dataParserNotSupport", schema.definition.inner),
				success(result, isOptional = false) {
					return E.right("buildSuccess", {
						schema: result,
						isOptional,
					});
				},
				buildError() {
					return E.left("buildDataParserError", schema);
				},
			},
		)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.inner),
		);
	});
});
