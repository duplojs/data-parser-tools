import { render, defaultTransformers, supportedVersions } from "@scripts/toJsonSchema";
import { DPE } from "@duplojs/utils";

describe("openapi versions", () => {
	it("builds components container", () => {
		const schema = DPE.string();

		expect(
			render(
				schema,
				{
					identifier: "OpenApiString",
					transformers: defaultTransformers,
					version: "openApi3",
				},
			),
		).toMatchSnapshot();
	});
});
