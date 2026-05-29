import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const optionalResearcher = createResearcher(
	DP.optionalKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.inner);
	},
);
