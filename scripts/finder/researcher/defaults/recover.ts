import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const recoverResearcher = createResearcher(
	DP.recoverKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.inner);
	},
);
