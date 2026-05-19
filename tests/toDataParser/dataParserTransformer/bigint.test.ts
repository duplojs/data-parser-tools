import { DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "BigintParser",
	transformers: tsDefaultTransformers,
};

describe("bigint", () => {
	it("renders bigint parser", () => {
		expect(
			render(
				DPE.bigint({ coerce: true }),
				{
					constName: "bigintParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("renders bigint parser without coerce", () => {
		expect(
			render(
				DPE.bigint(),
				{
					constName: "bigintParserNoCoerce",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.bigint({
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "bigintParserError",
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
