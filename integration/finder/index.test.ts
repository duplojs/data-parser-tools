import { dataParserFinder, defaultResearchers } from "@duplojs/data-parser-tools/finder";
import { DPE } from "@duplojs/utils";

describe("finder integration", () => {
	it("exposes the finder API from the package root export", () => {
		const target = DPE.number();
		const schema = DPE.object({
			profile: DPE.object({
				ids: DPE.array(target),
			}),
		});

		const result = dataParserFinder(
			schema,
			(dataParser) => dataParser === target,
			{
				researchers: [...defaultResearchers],
				ignore: new Set(),
			},
		);

		expect(result).toEqual([target]);
	});
});
