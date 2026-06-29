import { DPE } from "@duplojs/utils";
import { getRecursiveDataParser } from "@scripts/utils";

describe("getRecursiveDataParser", () => {
	it("detects self recursive lazy parser", () => {
		const schema: DPE.DataParser<unknown> = DPE.lazy(() => schema);

		expect(getRecursiveDataParser(schema)).toEqual([schema]);
	});
});
