import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { templateLiteralResearcher } from "@scripts/finder/researcher";

describe("templateLiteralResearcher", () => {
	it("finds parsers embedded in the template", () => {
		const target = DPE.number();
		const schema = DPE.templateLiteral(["prefix-", target, "-suffix"]);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [templateLiteralResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
