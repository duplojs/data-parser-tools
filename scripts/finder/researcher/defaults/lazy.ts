import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const lazyResearcher = createResearcher(
	DP.lazyKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.getter.value);
	},
);
