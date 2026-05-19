import { DP, DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "ObjectParser",
	transformers: tsDefaultTransformers,
};

describe("object", () => {
	it("renders object parser", () => {
		expect(
			render(
				DPE.object({
					foo: DPE.string(),
					bar: DPE.number(),
				}),
				{
					constName: "objectParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when a shape property cannot be rendered", () => {
		expect(
			() => render(
				DPE.object({
					foo: DPE.string(),
					bar: DPE.number(),
				}),
				{
					constName: "objectParserError",
					dataParserTransformers: [
						((dataParser, { buildError }) => DP.stringKind.has(dataParser)
							? buildError()
							: E.left("dataParserNotSupport", dataParser)),
						...defaultTransformers,
					],
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toThrow();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.object({
			foo: DPE.string(),
			bar: DPE.number(),
		}, {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "objectParserCheckerError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: [
						((checker, { buildError }) => (checker as any).kind === "forced-error"
							? buildError()
							: E.left("checkerNotSupport", checker)),
					],
					toTypescript,
				},
			),
		).toThrow();
	});
});
