import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { lazyResearcher } from "@scripts/finder/researcher";

describe("lazyResearcher", () => {
	it("finds the getter parser", () => {
		const target = DPE.number();
		const schema = DPE.lazy(() => target);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [lazyResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
