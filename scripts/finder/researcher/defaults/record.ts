import { A, DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const recordResearcher = createResearcher(
	DP.recordKind.has,
	(dataParser, params) => {
		A.map(
			[
				dataParser.definition.key,
				dataParser.definition.value,
			],
			params.find,
		);
	},
);
