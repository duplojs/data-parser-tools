import { SDP } from "@duplojs/server-utils";
import { createTransformer } from "../create";

export interface OpenapiJsonSchemaFile {
	type: "string";
	format: "binary";
}

export const fileTransformer = createTransformer(
	SDP.fileKind.has,
	(
		schema,
		{
			success,
			version,
			buildError,
		},
	) => {
		if (
			version !== "openApi3"
			&& version !== "openApi31"
		) {
			return buildError();
		}

		return success({
			type: "string",
			format: "binary",
		});
	},
);
