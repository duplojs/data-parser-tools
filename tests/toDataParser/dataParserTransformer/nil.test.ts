import { DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "NilParser",
	transformers: tsDefaultTransformers,
};

describe("nil", () => {
	it("renders nil parser", () => {
		expect(
			render(
				DPE.nil({ coerce: true }),
				{
					constName: "nilParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("renders nil parser without coerce", () => {
		expect(
			render(
				DPE.nil(),
				{
					constName: "nilParserNoCoerce",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.nil({ checkers: [{ kind: "forced-error" } as any] });

		expect(
			() => render(
				schema,
				{
					constName: "nilParserError",
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
