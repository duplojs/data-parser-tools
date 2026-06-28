import type { TypeNode } from "typescript";
import { type DP, E } from "@duplojs/utils";
import { type TransformerMode, type MapImportContext } from "../dataParserTransformer";

export type CheckerRefinerSuccessEither = E.Right<"buildSuccess", TypeNode>;

export type CheckerRefinerCheckerNotSupportedEither = E.Left<"checkerNotSupport", DP.DataParserCheckers>;

export type CheckerRefinerBuildErrorEither = E.Left<"buildCheckerError", DP.DataParserCheckers>;

export type MaybeCheckerRefinerEither =
	| CheckerRefinerSuccessEither
	| CheckerRefinerCheckerNotSupportedEither
	| CheckerRefinerBuildErrorEither;

export interface CheckerRefinerParams {
	readonly mode: TransformerMode;
	readonly importContext: MapImportContext;
	success(result: TypeNode): CheckerRefinerSuccessEither;
	buildError(): CheckerRefinerBuildErrorEither;
	addImport(path: string, typeName: string, type?: "default" | "namespace" | "direct"): void;
}

export type CheckerRefinerBuildFunction<
	GenericChecker extends DP.DataParserCheckers = DP.DataParserCheckers,
> = (
	checker: GenericChecker,
	currentTypeNode: TypeNode,
	params: CheckerRefinerParams,
) => MaybeCheckerRefinerEither;

export function createCheckerRefiner<
	GenericChecker extends DP.DataParserCheckers,
>(
	support: (checker: DP.DataParserCheckers) => checker is GenericChecker,
	builder: CheckerRefinerBuildFunction<GenericChecker>,
) {
	return (
		checker: DP.DataParserCheckers,
		currentTypeNode: TypeNode,
		params: CheckerRefinerParams,
	): MaybeCheckerRefinerEither => support(checker)
		? builder(
			checker as GenericChecker,
			currentTypeNode,
			params,
		)
		: E.left("checkerNotSupport", checker);
}
