import { DataParserToDataParser } from "@scripts/index";
import { asserts, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerNumberMax", () => {
	it("exclusive", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerNumberMax(10, { exclusive: true }),
			{ transformers: DataParserToDataParser.defaultCheckerTransformers },
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});

	it("non exclusive", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerNumberMax(10),
			{ transformers: DataParserToDataParser.defaultCheckerTransformers },
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
