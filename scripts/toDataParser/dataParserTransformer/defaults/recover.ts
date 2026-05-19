import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export const recoverTransformer = createTransformer(
	DP.recoverKind.has,
	(
		dataParser,
		{
			transformer,
		},
	) => transformer(dataParser.definition.inner),
);
