import { A, DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const unionResearcher = createResearcher(
	DP.unionKind.has,
	(dataParser, params) => {
		A.map(
			dataParser.definition.options,
			params.find,
		);
	},
);
