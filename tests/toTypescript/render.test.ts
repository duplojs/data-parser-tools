import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toTypescript";

describe("render", () => {
	it("normalizes the render identifier into a type identifier", () => {
		const identifier = "userType";
		const result = render(
			DPE.string(),
			{
				identifier,
				transformers: defaultTransformers,
				mode: "out",
			},
		);
		const renderedIdentifier = result.match(/export type (?<identifier>\w+)/)?.groups?.identifier;

		expect(identifier).toBe("userType");
		expect(renderedIdentifier).toBe("UserType");
	});
});
