import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { arrayResearcher } from "@scripts/finder/researcher";

describe("arrayResearcher", () => {
	it("finds the element parser", () => {
		const target = DPE.string();
		const schema = DPE.array(target);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [arrayResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
