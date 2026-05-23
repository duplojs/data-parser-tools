import { DataParserToDataParser } from "@scripts/index";
import { asserts, DDate, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerTimeMax", () => {
	it("basic", () => {
		const importContext = new Map();
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerTimeMax(DDate.createTime(2000, "millisecond")),
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext,
			},
		);

		asserts(result, E.isRight);
		expect(importContext.get("@duplojs/utils/date")).toStrictEqual({
			namespace: ["D"],
		});
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
