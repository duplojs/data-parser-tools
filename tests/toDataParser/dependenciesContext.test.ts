import { DP, E } from "@duplojs/utils";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";
import { defaultCheckerTransformers, defaultTransformers, buildContext, printer } from "@scripts/toDataParser";

describe("dependencies context", () => {
	it("dataParser with no identifier", () => {
		const dataParser = DP.object({
			name: DP.string(),
			age: DP.number(),
		});

		const result = E.unwrapRightOrThrow(
			buildContext(
				dataParser,
				{
					identifier: "test1",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		);

		expect([...result.context.entries()]).toStrictEqual([
			[
				expect.objectContaining(DP.emptyKind.setTo({})),
				expect.objectContaining({
					dependencies: new Set(),
				}),
			],
		]);

		expect(printer(result)).toMatchSnapshot();
	});

	it("dataParser with top level identifier but it doesn't match with builder identifier", () => {
		const dataParser = DP.object({
			name: DP.string(),
			age: DP.number(),
		}).addIdentifier("otherTest");

		const result = E.unwrapRightOrThrow(
			buildContext(
				dataParser,
				{
					identifier: "test2",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		);

		expect([...result.context.entries()]).toStrictEqual([
			[
				dataParser,
				expect.objectContaining({
					dependencies: new Set(),
				}),
			],
			[
				expect.objectContaining(DP.emptyKind.setTo({})),
				expect.objectContaining({
					dependencies: new Set([dataParser]),
				}),
			],
		]);

		expect(printer(result)).toMatchSnapshot();
	});

	it("dataParser with top level identifier", () => {
		const dataParser = DP.object({
			name: DP.string(),
			age: DP.number(),
		}).addIdentifier("test3");

		const result = E.unwrapRightOrThrow(
			buildContext(
				dataParser,
				{
					identifier: "test3",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		);

		expect([...result.context.entries()]).toStrictEqual([
			[
				dataParser,
				expect.objectContaining({
					dependencies: new Set([]),
				}),
			],
		]);

		expect(printer(result)).toMatchSnapshot();
	});

	it("dataParser with sub dataParser with identifier", () => {
		const userNameDataParser = DP.string().addIdentifier("UserName");
		const userAgeDataParser = DP.number().addIdentifier("UserAge");
		const dataParser = DP.object({
			name: userNameDataParser,
			age: userAgeDataParser,
		}).addIdentifier("otherTest");

		const result = E.unwrapRightOrThrow(
			buildContext(
				dataParser,
				{
					identifier: "test4",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		);

		expect([...result.context.entries()]).toStrictEqual([
			[
				userNameDataParser,
				expect.objectContaining({
					dependencies: new Set([]),
				}),
			],
			[
				userAgeDataParser,
				expect.objectContaining({
					dependencies: new Set([]),
				}),
			],
			[
				dataParser,
				expect.objectContaining({
					dependencies: new Set([userNameDataParser, userAgeDataParser]),
				}),
			],
			[
				expect.objectContaining(DP.emptyKind.setTo({})),
				expect.objectContaining({
					dependencies: new Set([dataParser]),
				}),
			],
		]);

		expect(printer(result)).toMatchSnapshot();
	});
});
