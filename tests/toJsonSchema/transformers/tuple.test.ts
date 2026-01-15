import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { tupleTransformer } from "@scripts/toJsonSchema/transformer/defaults";
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

describe("tuple", () => {
	it("fixed items", () => {
		expect(
			render(
				DPE.tuple([DPE.string(), DPE.number()]),
				{
					identifier: "TupleSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("with rest", () => {
		expect(
			render(
				DPE.tuple([DPE.string()], { rest: DPE.number() }),
				{
					identifier: "TupleSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when one item transform fails", () => {
		const schema = DPE.tuple([DPE.string(), DPE.number()]);
		const params = buildTransformerParams(
			schema,
			(inner) => DP.stringKind.has(inner)
				? E.left("dataParserNotSupport", inner)
				: E.right("buildSuccess", {
					schema: { type: "number" },
					isOptional: false,
				}),
		);

		expect(tupleTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.shape[0]),
		);
	});
});
