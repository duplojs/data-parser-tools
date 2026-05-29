import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const nullableResearcher = createResearcher(
	DP.nullableKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.inner);
	},
);
