import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { objectTransformer } from "@scripts/toJsonSchema/transformer/defaults";
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

describe("object", () => {
	it("marks optional properties with undefined support", () => {
		const schema = DPE.object({
			required: DPE.string(),
			optional: DPE.optional(DPE.number()),
			nullable: DPE.nullable(DPE.string()),
		});

		expect(
			render(
				schema,
				{
					identifier: "ObjectSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("drops optional properties from required list in input mode", () => {
		const schema = DPE.object({
			required: DPE.string(),
			optional: DPE.optional(DPE.number()),
			nullable: DPE.nullable(DPE.string()),
		});

		expect(
			render(
				schema,
				{
					identifier: "ObjectSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("omits required field when every property is optional", () => {
		expect(
			render(
				DPE.object({
					foo: DPE.optional(DPE.string()),
				}),
				{
					identifier: "ObjectOptionalSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when a property transform fails", () => {
		const schema = DPE.object({
			name: DPE.string(),
		});

		const params = buildTransformerParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.shape.name),
		);

		expect(objectTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.shape.name),
		);
	});
});
