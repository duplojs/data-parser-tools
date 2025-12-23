import {
	arrayTransformer,
	objectTransformer,
	recordTransformer,
	recoverTransformer,
	tupleTransformer,
	unionTransformer,
	nullableTransformer,
} from "@scripts/toJsonSchema/transformer/defaults";
import {
	supportedVersions,
	type TransformerParams,
} from "@scripts/toJsonSchema/transformer/create";
import { DP, DPE, E } from "@duplojs/utils";

function buildParams(
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

describe("error paths", () => {
	it("array returns left when element transform fails", () => {
		const schema = DPE.array(DPE.string());
		const params = buildParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.element),
		);

		expect(arrayTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.element),
		);
	});

	it("nullable returns left when inner transform fails", () => {
		const schema = DPE.nullable(DPE.string());
		const params = buildParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.inner),
		);

		expect(nullableTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.inner),
		);
	});

	it("record returns left when key transform fails", () => {
		const schema = DPE.record(DPE.string(), DPE.number());
		const params = buildParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.key),
		);

		expect(recordTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.key),
		);
	});

	it("record returns left when value transform fails", () => {
		const schema = DPE.record(DPE.string(), DPE.number());
		const params = buildParams(
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

	it("recover returns left when inner transform fails", () => {
		const schema = DPE.recover(DPE.string(), "");
		const params = buildParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.inner),
		);

		expect(recoverTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.inner),
		);
	});

	it("tuple returns left when one item transform fails", () => {
		const schema = DPE.tuple([DPE.string(), DPE.number()]);
		const params = buildParams(
			schema,
			(inner) => DP.stringKind.has(inner)
				? E.left("dataParserNotSupport", inner)
				: E.right("buildSuccess", {
					schema: { type: "number" },
					canBeUndefined: false,
				}),
		);

		expect(tupleTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.shape[0]),
		);
	});

	it("union returns left when one option transform fails", () => {
		const schema = DPE.union([DPE.string(), DPE.number()]);
		const params = buildParams(
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

	it("object returns left when a property transform fails", () => {
		const schema = DPE.object({
			name: DPE.string(),
		});

		const params = buildParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.shape.name),
		);

		expect(objectTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.shape.name),
		);
	});
});
