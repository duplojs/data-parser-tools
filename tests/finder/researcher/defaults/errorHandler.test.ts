import { DP, DPE } from "@duplojs/utils";
import { dataParserFinder } from "@scripts/finder";
import { errorHandlerResearcher } from "@scripts/finder/researcher";

describe("errorHandlerResearcher", () => {
	it("finds the inner parser", () => {
		const target = DPE.boolean();
		const schema = DPE.errorHandler(
			target,
			DP.createErrorMessageTransformer(DP.booleanKind, () => "Expected boolean."),
		);
		const result = dataParserFinder(
			schema,
			(dataParser) => dataParser === target,
			{
				researchers: [errorHandlerResearcher],
				ignore: new Set(),
			},
		);

		expect(
			result.map(
				(dataParser) => ({
					isTarget: dataParser === target,
					definition: dataParser.definition,
				}),
			),
		).toMatchSnapshot();
		expect(result).toEqual([target]);
	});
});
