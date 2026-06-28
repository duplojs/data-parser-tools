import { type MaybeCheckerRefinerEither, type CheckerRefinerParams, type createCheckerRefiner } from "./create";
import { type TransformerMode, type MapImportContext, createAddImport } from "../dataParserTransformer";
import { type TypeNode } from "typescript";
import { A, type DP, E, pipe, whenElse } from "@duplojs/utils";

export interface CheckerTransformerFunctionParams {
	readonly mode: TransformerMode;
	readonly refiners: readonly ReturnType<typeof createCheckerRefiner>[];
	readonly importContext: MapImportContext;
}

export function checkerRefiner(
	checker: DP.DataParserCheckers,
	currentTypeNode: TypeNode,
	params: CheckerTransformerFunctionParams,
) {
	const functionParams: CheckerRefinerParams = {
		mode: params.mode,
		importContext: params.importContext,
		success(result) {
			return E.right("buildSuccess", result);
		},
		buildError() {
			return E.left("buildCheckerError", checker);
		},
		addImport: createAddImport(params.importContext),
	};

	return A.reduce(
		params.refiners,
		A.reduceFrom<MaybeCheckerRefinerEither>(E.left("checkerNotSupport", checker)),
		({ element: functionBuilder, next, exit }) => pipe(
			functionBuilder(
				checker,
				currentTypeNode,
				functionParams,
			),
			whenElse(
				E.hasInformation("buildSuccess"),
				exit,
				next,
			),
		),
	);
}
