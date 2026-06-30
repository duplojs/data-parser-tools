import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const errorHandlerResearcher = createResearcher(
	DP.errorHandlerKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.inner);
	},
);
