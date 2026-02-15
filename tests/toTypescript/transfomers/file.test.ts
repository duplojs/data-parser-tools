import { SDP } from "@duplojs/server-utils";
import { defaultTransformers, type MapImportType, render } from "@scripts/toTypescript";

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

	it("with preset importType", () => {
		const importType: MapImportType = new Map();
		importType.set("@duplojs/server-utils/file", ["FileInterface"]);

		expect(
			render(
				SDP.file(),
				{
					identifier: "File",
					transformers: defaultTransformers,
					mode: "in",
					importType,
				},
			),
		).toMatchSnapshot();
	});
});
