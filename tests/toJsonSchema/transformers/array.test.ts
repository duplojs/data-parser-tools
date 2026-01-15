import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { arrayTransformer } from "@scripts/toJsonSchema/transformer/defaults";
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

describe("array", () => {
	it("renders items and constraints", () => {
		const schema = DPE.array(DPE.string()).addChecker(DP.checkerArrayMin(1));

		expect(
			render(
				schema,
				{
					identifier: "ArraySchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("renders max constraint", () => {
		const schema = DPE.array(DPE.string()).addChecker(DP.checkerArrayMax(2));

		expect(
			render(
				schema,
				{
					identifier: "ArraySchemaMax",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("ignores unknown checker", () => {
		const schema = DPE.array(DPE.string());
		// @ts-expect-error cover default branch for unknown checker
		schema.definition.checkers.push({ kind: "unknown-checker" });

		expect(
			render(
				schema,
				{
					identifier: "ArraySchemaUnknown",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("returns left when element transform fails", () => {
		const schema = DPE.array(DPE.string());
		const params = buildTransformerParams(
			schema,
			() => E.left("dataParserNotSupport", schema.definition.element),
		);

		expect(arrayTransformer(schema, params)).toStrictEqual(
			E.left("dataParserNotSupport", schema.definition.element),
		);
	});
});
