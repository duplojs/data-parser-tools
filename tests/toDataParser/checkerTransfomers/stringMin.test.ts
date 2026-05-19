import { DataParserToDataParser } from "@scripts/index";
import { asserts, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerStringMin", () => {
	it("basic", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerStringMin(2),
			{ transformers: DataParserToDataParser.defaultCheckerTransformers },
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
