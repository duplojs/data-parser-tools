import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { unionResearcher } from "@scripts/finder/researcher";

describe("unionResearcher", () => {
	it("finds parsers in the union options", () => {
		const target = DPE.boolean();
		const schema = DPE.union([target]);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [unionResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
