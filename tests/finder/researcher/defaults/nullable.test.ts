import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { nullableResearcher } from "@scripts/finder/researcher";

describe("nullableResearcher", () => {
	it("finds the inner parser", () => {
		const target = DPE.boolean();
		const schema = DPE.nullable(target);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [nullableResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
