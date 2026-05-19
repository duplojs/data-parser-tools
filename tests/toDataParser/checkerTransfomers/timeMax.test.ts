import { DataParserToDataParser } from "@scripts/index";
import { asserts, DDate, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerTimeMax", () => {
	it("basic", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerTimeMax(DDate.createTime(2000, "millisecond")),
			{ transformers: DataParserToDataParser.defaultCheckerTransformers },
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
