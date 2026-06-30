import { DPE, E } from "@duplojs/utils";
import { buildContext, defaultTransformers, render } from "@scripts/toTypescript";

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

	it("coverage: uses provided contexts", () => {
		expect(
			render(
				DPE.string(),
				{
					identifier: "WithContexts",
					transformers: defaultTransformers,
					context: new Map(),
					importContext: new Map(),
				},
			),
		).toBe("export type WithContexts = string;");
	});

	it("coverage: uses provided context with default import context", () => {
		expect(
			render(
				DPE.string(),
				{
					identifier: "WithContextOnly",
					transformers: defaultTransformers,
					context: new Map(),
				},
			),
		).toBe("export type WithContextOnly = string;");
	});

	it("coverage: uses default context with provided import context", () => {
		expect(
			render(
				DPE.string(),
				{
					identifier: "WithImportContextOnly",
					transformers: defaultTransformers,
					importContext: new Map(),
				},
			),
		).toBe("export type WithImportContextOnly = string;");
	});

	it("coverage: builds context with default maps", () => {
		expect(E.isRight(
			buildContext(
				DPE.string(),
				{
					identifier: "DefaultMaps",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		)).toBe(true);
	});
});
