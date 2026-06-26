import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";

export const errorHandlerTransformer = createTransformer(
	DP.errorHandlerKind.has,
	(
		dataParser,
		{
			transformer,
		},
	) => transformer(dataParser.definition.inner),
);
