import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { transformResearcher } from "@scripts/finder/researcher";

describe("transformResearcher", () => {
	it("finds the inner parser", () => {
		const target = DPE.time();
		const schema = DPE.transform(target, (value) => value);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [transformResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
