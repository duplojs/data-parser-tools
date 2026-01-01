import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { recordTransformer } from "@scripts/toJsonSchema/transformer/defaults";
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

describe("record", () => {
	it("with requireKey enforces exact keys", () => {
		const schema = DPE.record(DPE.literal(["a", "b"]), DPE.number());

		expect(
			render(
				schema,
				{
					identifier: "RecordSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("without requireKey keeps propertyNames/additionalProperties", () => {
		const schema = DPE.record(DPE.string(), DPE.number(), { requireKey: null });

		expect(
			render(
				schema,
				{
					identifier: "RecordSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when key transform fails", () => {
		const schema = DPE.record(DPE.string(), DPE.number());
		const params = buildTransformerParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.key),
		);

		expect(recordTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.key),
		);
	});

	it("returns left when value transform fails", () => {
		const schema = DPE.record(DPE.string(), DPE.number());
		const params = buildTransformerParams(
			schema,
			(inner) => DP.stringKind.has(inner)
				? E.right("buildSuccess", {
					schema: { type: "string" },
					canBeUndefined: false,
				})
				: E.left("dataParserNotSupport", inner),
		);

		expect(recordTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.value),
		);
	});
});
