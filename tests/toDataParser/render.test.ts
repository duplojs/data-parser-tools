import { DDate, DP, DPE } from "@duplojs/utils";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";
import { defaultCheckerTransformers, defaultTransformers, render } from "@scripts/toDataParser";

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
					constName: "recursiveNodeParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "RecursiveNode",
						transformers: tsDefaultTransformers,
					},
				},
			),
		).toMatchSnapshot();
	});

	it("renders named dependencies before their consumers", () => {
		const child = DPE.string().addConstName("childParser");
		const schema = DPE.object({ child }).addConstName("parentParser");

		expect(
			render(
				schema,
				{
					constName: "parentParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "Parent",
						transformers: tsDefaultTransformers,
					},
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
					constName: "complexRecursiveParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "ComplexRecursive",
						transformers: tsDefaultTransformers,
					},
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
					constName: "checkedParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "Checked",
						transformers: tsDefaultTransformers,
					},
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				checkedExtendedSchema,
				{
					constName: "checkedExtendedParser",
					importMode: "extended",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "CheckedExtended",
						transformers: tsDefaultTransformers,
					},
				},
			),
		).toMatchSnapshot();
	});

	it("renders dataParser in compact mode when indent is false", () => {
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
					constName: "compactParser",
					indent: false,
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript: {
						identifier: "CompactSchema",
						transformers: tsDefaultTransformers,
					},
				},
			),
		).toMatchSnapshot();
	});
});
