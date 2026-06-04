import { SDP } from "@duplojs/server-utils";
import { DataParserToDataParser } from "@scripts/index";
import { asserts, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerFileMimeType", () => {
	it("basic", () => {
		const importContext = new Map();
		const result = DataParserToDataParser.checkerTransformer(
			SDP.checkerFileMimeType(/^image\//),
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext,
			},
		);

		asserts(result, E.isRight);
		expect(importContext.get("@duplojs/server-utils/dataParser")).toStrictEqual({
			namespace: ["SDP"],
		});
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
