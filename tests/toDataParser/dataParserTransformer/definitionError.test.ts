import { SDP } from "@duplojs/server-utils";
import { DP, DPE, E } from "@duplojs/utils";
import {
	arrayTransformer,
	bigIntTransformer,
	booleanTransformer,
	dateTransformer,
	emptyTransformer,
	fileTransformer,
	lazyTransformer,
	literalTransformer,
	nilTransformer,
	nullableTransformer,
	numberTransformer,
	objectTransformer,
	optionalTransformer,
	pipeTransformer,
	recordTransformer,
	stringTransformer,
	templateLiteralTransformer,
	timeTransformer,
	transformTransformer,
	tupleTransformer,
	unionTransformer,
	unknownTransformer,
} from "@scripts/toDataParser/dataParserTransformer/defaults";
import { getDefinitionDataParser } from "@scripts/toDataParser";
import { factory } from "typescript";

describe("default dataParser transformers definition error", () => {
	const definitionErrorChecker = DP.checkerStringMin(1);

	const buildParams = (schema: DP.DataParser) => ({
		success: (result: any) => E.right("buildSuccess", result),
		transformer: () => E.right("buildSuccess", factory.createIdentifier("inner")),
		context: new Map(),
		dependencyIdentifier: factory.createIdentifier("DP"),
		buildError: () => E.left("buildDataParserError", schema),
		importContext: new Map(),
		getDefinition: () => E.left("buildDataParserGetDefinitionError", {
			dataParser: schema,
			error: E.left("buildCheckerError", schema.definition.checkers[0] ?? definitionErrorChecker),
		}),
		addImport: vi.fn(),
	}) as any;

	it.each([
		["array", arrayTransformer, DPE.array(DPE.string())],
		["bigint", bigIntTransformer, DPE.bigint()],
		["boolean", booleanTransformer, DPE.boolean()],
		["date", dateTransformer, DPE.date()],
		["empty", emptyTransformer, DPE.empty()],
		["file", fileTransformer, SDP.file()],
		["lazy", lazyTransformer, DPE.lazy(() => DPE.string())],
		["literal", literalTransformer, DPE.literal(["value"])],
		["nil", nilTransformer, DPE.nil()],
		["nullable", nullableTransformer, DPE.nullable(DPE.string())],
		["number", numberTransformer, DPE.number()],
		["object", objectTransformer, DPE.object({ value: DPE.string() })],
		["optional", optionalTransformer, DPE.optional(DPE.string())],
		["pipe", pipeTransformer, DPE.pipe(DPE.string(), DPE.number())],
		["record", recordTransformer, DPE.record(DPE.string(), DPE.number())],
		["string", stringTransformer, DPE.string()],
		["templateLiteral", templateLiteralTransformer, DPE.templateLiteral(["id-", DPE.string()])],
		["time", timeTransformer, DPE.time()],
		["transform", transformTransformer, DPE.transform(DPE.string(), (value) => value)],
		["tuple", tupleTransformer, DPE.tuple([DPE.string()], { rest: DPE.number() })],
		["union", unionTransformer, DPE.union([DPE.string(), DPE.number()])],
		["unknown", unknownTransformer, DPE.unknown()],
	])("returns definition error for %s", (__, transformer, schema) => {
		expect(transformer(schema as any, buildParams(schema as DP.DataParser))).toStrictEqual(
			E.left("buildDataParserGetDefinitionError", {
				dataParser: schema,
				error: E.left(
					"buildCheckerError",
					(schema as DP.DataParser).definition.checkers[0] ?? definitionErrorChecker,
				),
			}),
		);
	});

	it("returns getDefinitionDataParser error when checker transformation fails", () => {
		const dataParser = DPE.string({
			errorMessage: "Invalid string.",
			checkers: [DP.checkerStringMin(1)],
		});

		expect(
			getDefinitionDataParser({
				dataParser,
				checkerTransformers: [
					(checker, { buildError }) => DP.checkerStringMinKind.has(checker)
						? buildError()
						: E.left("checkerNotSupport", checker),
				],
				importContext: new Map(),
				customProperties: [],
			}),
		).toStrictEqual(
			E.left("buildDataParserGetDefinitionError", {
				dataParser,
				error: E.left("buildCheckerError", dataParser.definition.checkers[0]),
			}),
		);
	});
});
