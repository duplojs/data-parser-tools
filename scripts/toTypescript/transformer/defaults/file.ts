import { pipe } from "@duplojs/utils";
import { SDP } from "@duplojs/server-utils";
import { factory } from "typescript";
import { createTransformer } from "../create";

export const fileTransformer = createTransformer(
	SDP.fileKind.has,
	(
		schema,
		{
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/server-utils/file", "FileInterface");

		return pipe(
			"FileInterface",
			factory.createIdentifier,
			factory.createTypeReferenceNode,
			success,
		);
	},
);
