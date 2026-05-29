import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { recoverResearcher } from "@scripts/finder/researcher";

describe("recoverResearcher", () => {
	it("finds the inner parser", () => {
		const target = DPE.bigint();
		const schema = DPE.recover(target, 0n);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [recoverResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
