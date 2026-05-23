import { DataParserToDataParser } from "@scripts/index";
import { asserts, DP, E, unwrap } from "@duplojs/utils";
import { printExpression } from "./utils";

describe("checkerUrl", () => {
	it("with options", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerUrl({
				hostname: /^[a-z.-]+$/,
				normalize: true,
				protocol: /^https?$/,
			}),
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});

	it("without options", () => {
		const result = DataParserToDataParser.checkerTransformer(
			DP.checkerUrl(),
			{
				transformers: DataParserToDataParser.defaultCheckerTransformers,
				importContext: new Map(),
			},
		);

		asserts(result, E.isRight);
		expect(printExpression(unwrap(result))).toMatchSnapshot();
	});
});
