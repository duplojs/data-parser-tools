import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { optionalResearcher } from "@scripts/finder/researcher";

describe("optionalResearcher", () => {
	it("finds the inner parser", () => {
		const target = DPE.date();
		const schema = DPE.optional(target);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [optionalResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
