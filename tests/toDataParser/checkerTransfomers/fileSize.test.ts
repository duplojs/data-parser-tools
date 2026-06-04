import { SDP } from "@duplojs/server-utils";
import { DataParserToDataParser } from "@scripts/index";
import { asserts, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerFileSize", () => {
	it("with min and max", () => {
		const importContext = new Map();
		const result = DataParserToDataParser.checkerTransformer(
			SDP.checkerFileSize({
				min: 1,
				max: 10,
			}),
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

	it("with min only", () => {
		const importContext = new Map();
		const result = DataParserToDataParser.checkerTransformer(
			SDP.checkerFileSize({ min: 1 }),
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

	it("with max only", () => {
		const importContext = new Map();
		const result = DataParserToDataParser.checkerTransformer(
			SDP.checkerFileSize({ max: 10 }),
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
