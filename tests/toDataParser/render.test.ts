import { throws } from "node:assert/strict";
import { DDate, DP, DPE, E } from "@duplojs/utils";
import {
	defaultCheckerRefiners,
	defaultTransformers as tsDefaultTransformers,
} from "@scripts/toTypescript";
import {
	DataParserToDataParserRenderError,
	DataParserToDataParserTypeRenderError,
	defaultCheckerTransformers,
	defaultTransformers,
	render,
} from "@scripts/toDataParser";

describe("render", () => {
	it("renders anonymous recursive dataParser with a temporary const", () => {
		interface RecursiveNode {
			next: RecursiveNode;
		}

		const schema: DPE.DataParser<RecursiveNode> = DPE.object({
			next: DPE.lazy(() => schema),
		}).contract();

		expect(
			render(
				schema,
				{
					identifier: "recursiveNodeParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders anonymous recursive dataParser in extended mode", () => {
		interface RecursiveNode {
			next: RecursiveNode;
		}

		const schema: DPE.DataParser<RecursiveNode> = DPE.object({
			next: DPE.lazy(() => schema),
		}).contract();

		expect(
			render(
				schema,
				{
					identifier: "recursiveExtendedNodeParser",
					importMode: "extended",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders named dependencies before their consumers", () => {
		const child = DPE.string().addIdentifier("childParser");
		const schema = DPE.object({ child });

		expect(
			render(
				schema,
				{
					identifier: "parentParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders complex nested recursive dataParsers", () => {
		type RecursiveArray = (RecursiveArray | RecursiveObject | string)[];

		type RecursiveTuple = [
			string,
			RecursiveObject,
			(RecursiveTuple | RecursiveUnion | string)[],
		];

		type RecursiveUnion =
			| string
			| RecursiveObject
			| RecursiveTuple
			| RecursiveUnion[];

		interface RecursiveObject {
			recursiveProp: {
				self: RecursiveObject;
				array: RecursiveArray;
				tuple: RecursiveTuple;
				union: RecursiveUnion;
			};
			children: RecursiveObject[];
			tuple: RecursiveTuple;
			array: RecursiveArray;
			union: RecursiveUnion;
		}

		const schemaArray: DPE.DataParser<RecursiveArray> = DPE.array(
			DPE.union([
				DPE.string(),
				DPE.lazy(() => schemaArray),
				DPE.lazy(() => schema),
			]),
		).contract();

		const schemaTuple: DPE.DataParser<RecursiveTuple> = DPE.tuple([
			DPE.string(),
			DPE.lazy(() => schema),
			DPE.union([
				DPE.lazy(() => schemaTuple),
				DPE.lazy(() => schemaUnion),
				DPE.string(),
			]).array(),
		]).contract();

		const schemaUnion: DPE.DataParser<RecursiveUnion> = DPE.union([
			DPE.string(),
			DPE.lazy(() => schema),
			DPE.lazy(() => schemaTuple),
			DPE.array(DPE.lazy(() => schemaUnion)),
		]).contract();

		const schema: DPE.DataParser<RecursiveObject> = DPE.object({
			recursiveProp: DPE.object({
				self: DPE.lazy(() => schema),
				array: schemaArray,
				tuple: schemaTuple,
				union: schemaUnion,
			}),
			children: DPE.array(DPE.lazy(() => schema)),
			tuple: schemaTuple,
			array: schemaArray,
			union: schemaUnion,
		}).contract();

		expect(
			render(
				schema,
				{
					identifier: "complexRecursiveParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders checked dataParsers in normal and extended modes", () => {
		const checkedSchema = DP.object({
			startAt: DP.time().addChecker(
				DP.checkerTimeMin(DDate.createTime(1000, "millisecond")),
				DP.checkerTimeMax(DDate.createTime(5000, "millisecond")),
			),
			name: DP.string().addChecker(DP.checkerStringMin(2)),
			count: DP.number().addChecker(
				DP.checkerInt(),
				DP.checkerNumberMin(1),
			),
		});
		const checkedExtendedSchema = DPE.object({
			startAt: DPE
				.time()
				.min(DDate.createTime(250, "millisecond")),
			tags: DPE
				.string()
				.min(1)
				.array()
				.min(1),
		});

		expect(
			render(
				checkedSchema,
				{
					identifier: "checkedParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				checkedExtendedSchema,
				{
					identifier: "checkedExtendedParser",
					importMode: "extended",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders dataParser with nested checkers", () => {
		const compactSchema = DPE.object({
			name: DPE.string().min(2),
			roles: DPE.literal(["admin", "editor"]).array().min(1),
			contact: DPE.union([
				DPE.object({
					email: DPE.email(),
				}),
				DPE.object({
					phone: DPE.string().regex(/^[+\d][\d\s-]{5,}$/),
				}),
			]),
		});

		expect(
			render(
				compactSchema,
				{
					identifier: "compactParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("normalizes the render identifier into a dataParser const identifier", () => {
		const identifier = "UserParser";
		const result = render(
			DPE.string(),
			{
				identifier,
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
			},
		);
		const renderedIdentifier = result.match(/export const (?<identifier>\w+)/)?.groups?.identifier;

		expect(identifier).toBe("UserParser");
		expect(renderedIdentifier).toBe("userParserDataParser");
	});

	it("throws a render error when dataParser transformation fails", () => {
		throws(
			() => render(
				DPE.string(),
				{
					identifier: "renderError",
					dataParserTransformers: [(dataParser) => E.left("dataParserNotSupport", dataParser)],
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
			(error) => {
				expect(error).toBeInstanceOf(DataParserToDataParserRenderError);
				expect(
					E.hasInformation((error as DataParserToDataParserRenderError).error, "dataParserNotSupport"),
				).toBe(true);

				return true;
			},
		);
	});

	it("throws a type render error when recursive type transformation is not supported", () => {
		interface RecursiveNode {
			next: RecursiveNode;
		}

		const schema: DPE.DataParser<RecursiveNode> = DPE.object({
			next: DPE.lazy(() => schema),
		}).contract();

		throws(
			() => render(
				schema,
				{
					identifier: "recursiveNodeParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: [],
				},
			),
			(error) => {
				expect(error).toBeInstanceOf(DataParserToDataParserTypeRenderError);
				expect(
					E.hasInformation(
						(error as DataParserToDataParserTypeRenderError).error,
						"toTypescriptDataParserNotSupport",
					),
				).toBe(true);

				return true;
			},
		);
	});

	it("throws a type render error when recursive type transformation fails", () => {
		interface RecursiveNode {
			next: RecursiveNode;
		}

		const schema: DPE.DataParser<RecursiveNode> = DPE.object({
			next: DPE.lazy(() => schema),
		}).contract();

		throws(
			() => render(
				schema,
				{
					identifier: "recursiveNodeParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: [(__, { buildError }) => buildError()],
				},
			),
			(error) => {
				expect(error).toBeInstanceOf(DataParserToDataParserTypeRenderError);
				expect(
					E.hasInformation(
						(error as DataParserToDataParserTypeRenderError).error,
						"toTypescriptBuildDataParserError",
					),
				).toBe(true);

				return true;
			},
		);
	});

	it("throws a type render error when recursive checker refinement fails", () => {
		interface RecursiveNode {
			next: RecursiveNode;
		}

		const schema: DPE.DataParser<RecursiveNode> = DPE.object({
			next: DPE.lazy(() => schema),
		}, {
			checkers: [DP.checkerRefine(() => true)],
		}).contract();

		throws(
			() => render(
				schema,
				{
					identifier: "recursiveNodeParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
					typescriptCheckerRefiner: [
						(__, ___, { buildError }) => buildError(),
						...defaultCheckerRefiners,
					],
				},
			),
			(error) => {
				expect(error).toBeInstanceOf(DataParserToDataParserTypeRenderError);
				expect(
					E.hasInformation(
						(error as DataParserToDataParserTypeRenderError).error,
						"toTypescriptBuildCheckerError",
					),
				).toBe(true);

				return true;
			},
		);
	});

	it("runs dataParser transformer hooks", () => {
		const stopHook = vi.fn(({ output }) => output("stop", DPE.string()));
		const shouldNotRun = vi.fn(({ output, dataParser }) => output("next", dataParser));

		const result = render(
			DPE.number(),
			{
				identifier: "hookStopParser",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
				hooks: [stopHook, shouldNotRun],
			},
		);

		expect(stopHook).toHaveBeenCalledTimes(1);
		expect(shouldNotRun).not.toHaveBeenCalled();
		expect(result).toContain("DP.string()");
	});

	it("chains dataParser transformer hooks", () => {
		const useLessHook = vi.fn(({ output, dataParser }) => output("next", dataParser));
		const replaceHook = vi.fn(({ output }) => output("stop", DPE.string()));

		const result = render(
			DPE.number(),
			{
				identifier: "hookNextParser",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
				hooks: [useLessHook, replaceHook],
			},
		);

		expect(useLessHook).toHaveBeenCalledTimes(1);
		expect(replaceHook).toHaveBeenCalledTimes(1);
		expect(result).toContain("DP.string()");
	});

	it("keep identifier", () => {
		const result = render(
			DPE.number().setIdentifier("testKeepIdentifier"),
			{
				identifier: "testKeepIdentifier",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
				keepIdentifier: true,
			},
		);

		expect(result).toMatchSnapshot();
	});
});
