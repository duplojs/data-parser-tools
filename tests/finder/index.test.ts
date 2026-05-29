import { DP, DPE } from "@duplojs/utils";
import { dataParserFinder, lazyResearcher, objectResearcher, unionResearcher } from "@scripts/finder";

describe("dataParserFinder", () => {
	it("does not loop forever on recursive dataParsers", () => {
		interface RecursiveNode {
			next: RecursiveNode;
		}

		const schema: DPE.DataParser<RecursiveNode> = DPE.object({
			next: DPE.lazy(() => schema),
		}).contract();

		expect(
			dataParserFinder(
				schema,
				DP.objectKind.has,
				{
					researchers: [
						objectResearcher,
						lazyResearcher,
					],
					continueAfterMatch: true,
				},
			),
		).toEqual([schema]);
	});

	it("stop after match", () => {
		const schema = DPE.object({
			prop1: DPE.object({}),
			prop2: DPE.object({}),
			prop3: DPE.object({}),
		});

		expect(
			dataParserFinder(
				schema,
				DP.objectKind.has,
				{
					researchers: [
						objectResearcher,
						lazyResearcher,
					],
				},
			),
		).toEqual([schema]);
	});

	it("continue after match", () => {
		const prop1 = DPE.object({});
		const prop2 = DPE.object({});
		const prop3 = DPE.object({});
		const schema = DPE.object({
			prop1,
			prop2,
			prop3,
		});

		expect(
			dataParserFinder(
				schema,
				DP.objectKind.has,
				{
					researchers: [
						objectResearcher,
						lazyResearcher,
					],
					continueAfterMatch: true,
				},
			),
		).toEqual([schema, prop1, prop2, prop3]);
	});

	it("deduplicates a matched dataParser referenced by multiple branches", () => {
		const target = DPE.string();
		const schema = DPE.union([target, target]);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [],
				},
			),
		).toEqual([]);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [unionResearcher],
				},
			),
		).toEqual([target]);
	});
});
