import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { nullableTransformer } from "@scripts/toJsonSchema/transformer/defaults";
import {
	supportedVersions,
	type TransformerParams,
} from "@scripts/toJsonSchema/transformer/create";
import { type DP, DPE, E } from "@duplojs/utils";

function buildTransformerParams(
	schema: DP.DataParser,
	transformer: TransformerParams["transformer"],
): TransformerParams {
	return {
		mode: "out",
		context: new Map(),
		version: supportedVersions.jsonSchema7,
		transformer,
		success(result, isOptional = false) {
			return E.right("buildSuccess", {
				schema: result,
				isOptional,
			});
		},
		buildError() {
			return E.left("buildDataParserError", schema);
		},
	};
}

describe("nullable", () => {
	it("out mode keeps inner", () => {
		expect(
			render(
				DPE.nullable(DPE.string()),
				{
					identifier: "NullableSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("in mode union with null", () => {
		expect(
			render(
				DPE.nullable(DPE.string()),
				{
					identifier: "NullableSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when inner transform fails", () => {
		const schema = DPE.nullable(DPE.string());
		const params = buildTransformerParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.inner),
		);

		expect(nullableTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.inner),
		);
	});
});
