import { render, defaultTransformers } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("recursive", () => {
	it("with identified objet schema ", () => {
		interface RecursiveObject {
			recursiveProp: RecursiveObject;
		}

		const schema: DPE.Contract<RecursiveObject> = DPE.object({
			recursiveProp: DPE.lazy(() => schema),
		}).addIdentifier("RecursiveObject");

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});

	it("with unknown object schema", () => {
		interface RecursiveObject {
			recursiveProp: RecursiveObject;
		}

		const schema: DPE.Contract<RecursiveObject> = DPE.object({
			recursiveProp: DPE.lazy(() => schema),
		});

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					version: "jsonSchema7",

				},
			),
		).toMatchSnapshot();
	});

	it("with conflict identified object schema", () => {
		interface RecursiveObject {
			recursiveProp: RecursiveObject;
		}

		const schema: DPE.Contract<RecursiveObject> = DPE.object({
			recursiveProp: DPE.lazy(() => schema),
		}).addIdentifier("Test");

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",

				},
			),
		).toMatchSnapshot();
	});

	it("with tuple", () => {
		type RecursiveTuple = [string, (RecursiveTuple | string)[]];

		const schema: DPE.Contract<RecursiveTuple> = DPE.tuple([
			DPE.string(),
			DPE.lazy(() => schema).or(DPE.string()).array(),
		]);

		expect(
			render(
				schema,
				{
					identifier: "RecursiveTuple",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",

				},
			),
		).toMatchSnapshot();
	});

	it("with array", () => {
		type RecursiveArray = (RecursiveArray | string)[];

		const schema: DPE.Contract<RecursiveArray> = DPE.array(
			DPE.string().or(DPE.lazy(() => schema)),
		);

		expect(
			render(
				schema,
				{
					identifier: "RecursiveTuple",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",

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

		const schemaArray: DPE.Contract<RecursiveArray> = DPE.array(
			DPE.string().or(DPE.lazy(() => schemaArray)),
		);

		const schemaTuple: DPE.Contract<RecursiveTuple> = DPE.tuple([
			DPE.string(),
			DPE.lazy(() => schemaTuple).or(DPE.string()).array(),
		]);

		const schema: DPE.Contract<RecursiveObject> = DPE.object({
			recursiveProp: DPE.object({
				test: DPE.lazy(() => schema),
			}),
			tuple: schemaTuple,
			array: schemaArray,
		});

		expect(
			render(
				schema,
				{
					identifier: "RecursiveObject",
					transformers: defaultTransformers,
					mode: "out",
					version: "jsonSchema7",

				},
			),
		).toMatchSnapshot();
	});

	it("with union", () => {
			type RecursiveUnion = string | number | RecursiveUnion[];

			const schema: DPE.Contract<RecursiveUnion> = DPE.union([
				DPE.string(),
				DPE.number(),
				DPE.lazy(() => schema).array(),
			]);

			expect(
				render(
					schema,
					{
						identifier: "RecursiveUnion",
						transformers: defaultTransformers,
						mode: "out",
						version: "jsonSchema7",
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
					version: "jsonSchema7",
				},
			),
		).toMatchSnapshot();
	});
});
