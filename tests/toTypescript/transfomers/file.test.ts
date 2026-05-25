import { SDP } from "@duplojs/server-utils";
import { defaultTransformers, type MapImportContext, render } from "@scripts/toTypescript";

describe("file", () => {
	it("basic", () => {
		expect(
			render(
				SDP.file(),
				{
					identifier: "File",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		const schema = SDP.file().addIdentifier("FileIdentifier");

		expect(
			render(
				schema,
				{
					identifier: "FileIdentifier",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("with preset importContext", () => {
		const importContext: MapImportContext = new Map();
		importContext.set("@duplojs/server-utils/file", { direct: ["FileInterface"] });

		expect(
			render(
				SDP.file(),
				{
					identifier: "File",
					transformers: defaultTransformers,
					mode: "in",
					importContext,
				},
			),
		).toMatchSnapshot();
	});
});
