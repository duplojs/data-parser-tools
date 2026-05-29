import { A, DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const tupleResearcher = createResearcher(
	DP.tupleKind.has,
	(dataParser, params) => {
		A.map(
			dataParser.definition.shape,
			params.find,
		);

		if (dataParser.definition.rest) {
			params.find(dataParser.definition.rest);
		}
	},
);
