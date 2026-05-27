/* eslint-disable @typescript-eslint/consistent-type-imports */
import { DataParserToDataParser } from "@scripts/index";
import { asserts, DP, E, unwrap } from "@duplojs/utils";
import { afterEach, vi } from "vitest";
import { printExpression } from "./utils";

afterEach(() => {
	vi.resetModules();
	vi.doUnmock("typescript");
});

describe("checkerRefine", () => {
	it("basic", () => {
		const checker = DP.checkerRefine((value: number[]) => value.length > 0);
		const result = DataParserToDataParser.checkerTransformer(
			checker,
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});

	it("native function error", () => {
		const checker = DP.checkerRefine(Array.isArray as never);
		const result = DataParserToDataParser.checkerTransformer(
			checker,
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		expect(result).toEqual(E.left("buildCheckerError", checker));
	});

	it("invalid source statement error", () => {
		const checker = DP.checkerRefine(() => true);
		(checker.definition.theFunction as { toString(): string }).toString = () => ";";

		const result = DataParserToDataParser.checkerTransformer(
			checker,
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		expect(result).toEqual(E.left("buildCheckerError", checker));
	});

	it("non function expression error", () => {
		const checker = DP.checkerRefine(() => true);
		(checker.definition.theFunction as { toString(): string }).toString = () => "1 + 1";

		const result = DataParserToDataParser.checkerTransformer(
			checker,
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		expect(result).toEqual(E.left("buildCheckerError", checker));
	});

	it("error when sourceFile has no statement", async() => {
		vi.doMock("typescript", async() => {
			const actual = await vi.importActual<typeof import("typescript")>("typescript");
			return {
				...actual,
				createSourceFile() {
					return { statements: [] };
				},
			};
		});

		const { checkerRefineTransformer } = await import("@scripts/toDataParser/checkerTransformer/defaults/refine");
		const checker = DP.checkerRefine(() => true);
		const importContext = new Map();
		const result = checkerRefineTransformer(checker, {
			importContext,
			success(value) {
				return E.right("buildSuccess", value);
			},
			buildError() {
				return E.left("buildCheckerError", checker);
			},
			addImport() {},
			getDefinition() {
				return [];
			},
		});

		expect(result).toEqual(E.left("buildCheckerError", checker));
	});

	it("error when expression is not parenthesized", async() => {
		vi.doMock("typescript", async() => {
			const actual = await vi.importActual<typeof import("typescript")>("typescript");
			return {
				...actual,
				isParenthesizedExpression() {
					return false;
				},
			};
		});

		const { checkerRefineTransformer } = await import("@scripts/toDataParser/checkerTransformer/defaults/refine");
		const checker = DP.checkerRefine(() => true);
		const importContext = new Map();
		const result = checkerRefineTransformer(checker, {
			importContext,
			success(value) {
				return E.right("buildSuccess", value);
			},
			buildError() {
				return E.left("buildCheckerError", checker);
			},
			addImport() {},
			getDefinition() {
				return [];
			},
		});

		expect(result).toEqual(E.left("buildCheckerError", checker));
	});
});
