import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { objectResearcher } from "@scripts/finder/researcher";

describe("objectResearcher", () => {
	it("finds parsers in the object shape", () => {
		const target = DPE.string();
		const schema = DPE.object({ value: target });

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [objectResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
