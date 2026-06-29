import "@scripts/toDataParser/override";
import { DP, E } from "@duplojs/utils";
import { checkerTransformer, getCheckerDefinition } from "@scripts/toDataParser";
import { factory } from "typescript";

describe("checker transformer override and definition", () => {
	it("builds checker definition with error message", () => {
		const checker = DP.checkerStringMin(1, {
			errorMessage: "Too short.",
		});

		expect(getCheckerDefinition(checker)).toHaveLength(1);
	});

	it("applies map imports from checker definition", () => {
		const checker = DP.checkerStringMin(1)
			.addMapImportContextEntries(["module-a", { direct: ["checkerImport"] }]);
		const importContext = new Map();

		const result = checkerTransformer(
			checker,
			{
				transformers: [(__, { success }) => success(factory.createIdentifier("checkerImport"))],
				importContext,
			},
		);

		expect(E.isRight(result)).toBe(true);
		expect(importContext.get("module-a")).toEqual({ direct: ["checkerImport"] });
	});

	it("uses override checker transformer", () => {
		const checker = DP.checkerStringMin(1)
			.addOverrideCheckerTransformer(factory.createIdentifier("overrideChecker"));

		expect(
			checkerTransformer(
				checker,
				{
					transformers: [],
					importContext: new Map(),
				},
			),
		).toStrictEqual(
			E.right("buildSuccess", factory.createIdentifier("overrideChecker")),
		);
	});
});
