import { DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const arrayResearcher = createResearcher(
	DP.arrayKind.has,
	(dataParser, params) => {
		params.find(dataParser.definition.element);
	},
);
