import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { recordResearcher } from "@scripts/finder/researcher";

describe("recordResearcher", () => {
	it("finds the key parser", () => {
		const target = DPE.string();
		const schema = DPE.record(target, DPE.number());

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [recordResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});

	it("finds the value parser", () => {
		const target = DPE.number();
		const schema = DPE.record(DPE.string(), target);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [recordResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
