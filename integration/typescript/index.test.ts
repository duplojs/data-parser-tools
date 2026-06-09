import { Typescript } from "@duplojs/data-parser-tools/typescript";
import * as ts from "typescript";

describe("typescript integration", () => {
	it("exports the TypeScript package namespace from the built subpath", () => {
		const identifier = Typescript.factory.createIdentifier("value");

		expect(Typescript).toBe(ts);
		expect(identifier.kind).toBe(ts.SyntaxKind.Identifier);
		expect(identifier.text).toBe("value");
	});
});
