import { A, DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const pipeResearcher = createResearcher(
	DP.pipeKind.has,
	(dataParser, params) => {
		A.map(
			[
				dataParser.definition.input,
				dataParser.definition.output,
			],
			params.find,
		);
	},
);
