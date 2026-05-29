import { A, DP, O, pipe } from "@duplojs/utils";
import { createResearcher } from "../create";

export const objectResearcher = createResearcher(
	DP.objectKind.has,
	(dataParser, params) => {
		pipe(
			dataParser.definition.shape,
			O.values,
			A.map(params.find),
		);
	},
);
