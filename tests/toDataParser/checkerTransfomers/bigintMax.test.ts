import { DataParserToDataParser } from "@scripts/index";
import { asserts, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerBigIntMax", () => {
	it("basic", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerBigIntMax(10n),
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
