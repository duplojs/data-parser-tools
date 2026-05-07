import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("recursive", () => {
	it("with identified objet schema ", () => {
		interface RecursiveObject {
			recursiveProp: RecursiveObject;
		}

		const schema: DPE.DataParser<RecursiveObject> = DPE.object({
			recursiveProp: DPE.lazy(() => schema),
		}).addIdentifier("RecursiveObject").contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("with unknown object schema", () => {
		interface RecursiveObject {
			recursiveProp: RecursiveObject;
		}

		const schema: DPE.DataParser<RecursiveObject> = DPE.object({
			recursiveProp: DPE.lazy(() => schema),
		}).contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("with conflict identified object schema", () => {
		interface RecursiveObject {
			recursiveProp: RecursiveObject;
		}

		const schema: DPE.DataParser<RecursiveObject> = DPE.object({
			recursiveProp: DPE.lazy(() => schema),
		}).addIdentifier("Test").contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("with tuple", () => {
		type RecursiveTuple = [string, (RecursiveTuple | string)[]];

		const schema: DPE.DataParser<RecursiveTuple> = DPE.tuple([
			DPE.string(),
			DPE.lazy(() => schema).or(DPE.string()).array(),
		]).contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveTuple",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("with array", () => {
		type RecursiveArray = (RecursiveArray | string)[];

		const schema: DPE.DataParser<RecursiveArray> = DPE.array(
			DPE.string().or(DPE.lazy(() => schema)),
		).contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveTuple",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("with complex recursive schema", () => {
		type RecursiveArray = (RecursiveArray | string)[];

		type RecursiveTuple = [string, (RecursiveTuple | string)[]];

		interface RecursiveObject {
			recursiveProp: {
				test: RecursiveObject;
			};
			tuple: RecursiveTuple;
			array: RecursiveArray;
		}

		const schemaArray: DPE.DataParser<RecursiveArray> = DPE.array(
			DPE.string().or(DPE.lazy(() => schemaArray)),
		).contract();

		const schemaTuple: DPE.DataParser<RecursiveTuple> = DPE.tuple([
			DPE.string(),
			DPE.lazy(() => schemaTuple).or(DPE.string()).array(),
		]).contract();

		const schema: DPE.DataParser<RecursiveObject> = DPE.object({
			recursiveProp: DPE.object({
				test: DPE.lazy(() => schema),
			}),
			tuple: schemaTuple,
			array: schemaArray,
		}).contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("with union", () => {
		type RecursiveUnion = string | number | RecursiveUnion[];

		const schema: DPE.DataParser<RecursiveUnion> = DPE.union([
			DPE.string(),
			DPE.number(),
			DPE.lazy(() => schema).array(),
		]).contract();

		expect(
			render(
				schema,
				{
					identifier: "RecursiveUnion",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("when using an schema two time but non recursive", () => {
		const innerSchema = DPE.object({
			prop: DPE.string(),
		});

		const schema = DPE.object({
			one: innerSchema,
			two: innerSchema,
		});

		expect(
			render(
				schema,
				{
					identifier: "noneRecursive",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
