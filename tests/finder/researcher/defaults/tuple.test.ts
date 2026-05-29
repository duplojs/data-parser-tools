import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { tupleResearcher } from "@scripts/finder/researcher";

describe("tupleResearcher", () => {
	it("finds parsers in the tuple shape", () => {
		const target = DPE.string();
		const schema = DPE.tuple([target]);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [tupleResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});

	it("finds the rest parser", () => {
		const target = DPE.number();
		const schema = DPE.tuple([DPE.string()], { rest: target });

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [tupleResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
