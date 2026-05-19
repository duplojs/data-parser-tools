import { SDP } from "@duplojs/server-utils";
import { E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

const toTypescript = {
	identifier: "FileParser",
	transformers: tsDefaultTransformers,
};

describe("file", () => {
	it("renders file parser with async constraints", () => {
		expect(
			render(
				SDP.coerce.file({
					checkExist: true,
					maxSize: 10,
					minSize: 5,
					mimeType: /image\/png/,
				}),
				{
					constName: "fileParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("renders file parser without options", () => {
		expect(
			render(
				SDP.file(),
				{
					constName: "fileParserNoOptions",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("renders extended file parser namespace", () => {
		expect(
			render(
				SDP.file(),
				{
					constName: "fileParserExtended",
					exportMode: "extended",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					toTypescript,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = SDP.file({}, {
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					constName: "fileParserError",
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
