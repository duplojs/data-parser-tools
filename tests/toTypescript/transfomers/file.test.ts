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
});
