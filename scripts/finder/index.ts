import { A, type DP } from "@duplojs/utils";
import { type ResearcherParams, type createResearcher } from "./researcher";

export * from "./researcher";

export interface DataParserFinderParams {
	researchers: ReturnType<typeof createResearcher>[];
	ignore?: Set<DP.DataParser>;
	continueAfterMatch?: boolean;
}

export function dataParserFinder<
	GenericPredicate extends DP.DataParsers,
>(
	dataParser: DP.DataParser,
	predicate: (dataParser: DP.DataParsers) => dataParser is GenericPredicate,
	params: DataParserFinderParams,
): GenericPredicate[];

export function dataParserFinder(
	dataParser: DP.DataParser,
	predicate: (dataParser: DP.DataParsers) => boolean,
	params: DataParserFinderParams,
): DP.DataParsers[];

export function dataParserFinder(
	dataParser: DP.DataParser,
	predicate: (dataParser: DP.DataParsers) => boolean,
	params: DataParserFinderParams,
) {
	const result: DP.DataParsers[] = [];
	const ignoreContext = params.ignore ?? new Set();

	if (ignoreContext.has(dataParser)) {
		return result;
	}

	ignoreContext.add(dataParser);

	if (predicate(dataParser)) {
		result.push(dataParser);

		if (params.continueAfterMatch !== true) {
			return result;
		}
	}

	const researcherParams: ResearcherParams = {
		find(dataParser) {
			result.push(
				...dataParserFinder(
					dataParser,
					predicate,
					{
						...params,
						ignore: ignoreContext,
					},
				),
			);
		},
	};

	A.map(
		params.researchers,
		(researcher) => void researcher(dataParser, researcherParams),
	);

	return result;
}
