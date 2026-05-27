import { DataParserToDataParser } from "@scripts/index";
import { asserts, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerArrayMax", () => {
	it("basic", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerArrayMax(5),
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
