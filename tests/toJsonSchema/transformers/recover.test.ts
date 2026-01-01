import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { recoverTransformer } from "@scripts/toJsonSchema/transformer/defaults";
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
		success(result, canBeUndefined = false) {
			return E.right("buildSuccess", {
				schema: result,
				canBeUndefined,
			});
		},
		buildError() {
			return E.left("buildDataParserError", schema);
		},
	};
}

describe("recover", () => {
	it("in mode produces unknown", () => {
		expect(
			render(
				DPE.recover(DPE.string(), undefined),
				{
					identifier: "RecoverSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("out mode uses inner schema", () => {
		expect(
			render(
				DPE.recover(DPE.string(), undefined),
				{
					identifier: "RecoverSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when inner transform fails", () => {
		const schema = DPE.recover(DPE.string(), "");
		const params = buildTransformerParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.inner),
		);

		expect(recoverTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.inner),
		);
	});
});
