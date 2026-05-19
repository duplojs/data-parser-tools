import { DPE, E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "UnknownParser",
	transformers: tsDefaultTransformers,
};

describe("unknown", () => {
	it("renders unknown parser", () => {
		expect(
			render(
				DPE.unknown(),
				{
					constName: "unknownParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = DPE.unknown({
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "unknownParserError",
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
