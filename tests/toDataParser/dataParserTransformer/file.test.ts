import { SDP } from "@duplojs/server-utils";
import { E } from "@duplojs/utils";
import { defaultTransformers, defaultCheckerTransformers, render } from "@scripts/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@scripts/toTypescript";

describe("file", () => {
	it("renders file parser with async constraints", () => {
		expect(
			render(
				SDP.coerce.file(),
				{
					identifier: "fileParser",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders file parser without options", () => {
		expect(
			render(
				SDP.file(),
				{
					identifier: "fileParserNoOptions",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders extended file parser namespace", () => {
		expect(
			render(
				SDP.file(),
				{
					identifier: "fileParserExtended",
					importMode: "extended",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders file parser with definition checkers", () => {
		expect(
			render(
				SDP.file({
					checkers: [
						SDP.checkerFileExist(),
						SDP.checkerFileMimeType(/^image\//),
					],
				}),
				{
					identifier: "fileParserWithDefinitionCheckers",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("renders file parser with addChecker", () => {
		expect(
			render(
				SDP.file().addChecker(
					SDP.checkerFileSize({
						min: 1,
						max: 10,
					}),
				),
				{
					identifier: "fileParserWithAddChecker",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: defaultCheckerTransformers,
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toMatchSnapshot();
	});

	it("fails when definition checker cannot be rendered", () => {
		const schema = SDP.file({
			checkers: [{ kind: "forced-error" } as any],
		});

		expect(
			() => render(
				schema,
				{
					identifier: "fileParserError",
					dataParserTransformers: defaultTransformers,
					checkerTransformers: [
						((checker, { buildError }) => (checker as any).kind === "forced-error"
							? buildError()
							: E.left("checkerNotSupport", checker)),
					],
					typescriptTransformers: tsDefaultTransformers,
				},
			),
		).toThrow();
	});
});
