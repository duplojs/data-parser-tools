import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { unionTransformer } from "@scripts/toJsonSchema/transformer/defaults";
import {
	supportedVersions,
	type TransformerParams,
} from "@scripts/toJsonSchema/transformer/create";
import { DP, DPE, E } from "@duplojs/utils";

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

describe("union", () => {
	it("merges schemas and propagates canBeUndefined", () => {
		expect(
			render(
				DPE.union([DPE.string(), DPE.optional(DPE.number())]),
				{
					identifier: "UnionSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when one option transform fails", () => {
		const schema = DPE.union([DPE.string(), DPE.number()]);
		const params = buildTransformerParams(
			schema,
			(inner) => DP.stringKind.has(inner)
				? E.left("dataParserNotSupport", inner)
				: E.right("buildSuccess", {
					schema: { type: "number" },
					canBeUndefined: false,
				}),
		);

		expect(unionTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.options[0]),
		);
	});
});
