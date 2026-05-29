import { A, DP } from "@duplojs/utils";
import { createResearcher } from "../create";

export const templateLiteralResearcher = createResearcher(
	DP.templateLiteralKind.has,
	(dataParser, params) => {
		A.map(
			dataParser.definition.template,
			(part) => {
				if (DP.dataParserKind.has(part)) {
					params.find(part);
				}
			},
		);
	},
);
