import { render, defaultTransformers, DataParserToJsonSchemaRenderError } from "@scripts/toJsonSchema";
import { SDP } from "@duplojs/server-utils";

describe("file", () => {
	it("renders schema", () => {
		const schema = SDP.file();

		expect(
			render(
				schema,
				{
					identifier: "FileSchema",
					transformers: defaultTransformers,
					mode: "out",
					version: "openApi3",
				},
			),
		).toMatchSnapshot();
	});

	it("error on version jsonSchema", () => {
		const schema = SDP.file();

		expect(
			() => render(
				schema,
				{
					identifier: "FileSchema",
					transformers: defaultTransformers,
					mode: "in",
					version: "jsonSchema7",
				},
			),
		).toThrowError(DataParserToJsonSchemaRenderError);
	});
});
