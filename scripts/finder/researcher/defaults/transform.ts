import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const transformResearcher = createResearcher(
	DP.transformKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.inner);
	},
);
