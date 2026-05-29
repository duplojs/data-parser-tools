import { DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { pipeResearcher } from "@scripts/finder/researcher";

describe("pipeResearcher", () => {
	it("finds the input parser", () => {
		const target = DPE.nil();
		const schema = DPE.pipe(target, DPE.unknown());

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [pipeResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});

	it("finds the output parser", () => {
		const target = DPE.unknown();
		const schema = DPE.pipe(DPE.nil(), target);

		expect(
			dataParserFinder(
				schema,
				(dataParser) => dataParser === target,
				{
					researchers: [pipeResearcher],
					ignore: new Set(),
				},
			),
		).toEqual([target]);
	});
});
