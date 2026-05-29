import { type DP } from "@duplojs/utils";

export interface ResearcherParams {
	find(dataParser: DP.DataParser): void;
}

export function createResearcher<
	GenericPredicate extends DP.DataParsers,
>(
	predicate: (dataParser: DP.DataParsers) => dataParser is GenericPredicate,
	researcher: (dataParser: GenericPredicate, params: ResearcherParams) => void,
): (dataParser: DP.DataParser, params: ResearcherParams) => void;

export function createResearcher(
	predicate: (dataParser: DP.DataParsers) => boolean,
	researcher: (dataParser: DP.DataParser, params: ResearcherParams) => void,
): (dataParser: DP.DataParser, params: ResearcherParams) => void;

export function createResearcher(
	predicate: (dataParser: DP.DataParsers) => boolean,
	researcher: (dataParser: DP.DataParser, params: ResearcherParams) => void,
) {
	return (
		dataParser: DP.DataParser,
		params: ResearcherParams,
	) => {
		if (predicate(dataParser)) {
			researcher(dataParser, params);
		}
	};
}
