import { Typescript } from "@scripts/typescript";
import * as ts from "typescript";

describe("toTypescript exports", () => {
	it("exports the TypeScript factory", () => {
		expect(Typescript).toBe(ts);
	});
});
