import type { CallExpression, ObjectLiteralExpression, PropertyAssignment } from "typescript";
import { type DP, E } from "@duplojs/utils";
import type * as TST from "@scripts/toTypescript";

export type CheckerTransformerSuccessEither = E.Right<"buildSuccess", CallExpression>;

export type CheckerTransformerCheckerNotSupportedEither = E.Left<"checkerNotSupport", DP.DataParserChecker>;

export type CheckerTransformerBuildErrorEither = E.Left<"buildCheckerError", DP.DataParserChecker>;

export type CheckerTransformerEither =
	| CheckerTransformerSuccessEither
	| CheckerTransformerCheckerNotSupportedEither
	| CheckerTransformerBuildErrorEither;

export interface CheckerTransformerParams {
	readonly importContext: TST.MapImportContext;

	success(
		result: CallExpression,
	): CheckerTransformerSuccessEither;
	buildError(): CheckerTransformerBuildErrorEither;
	addImport(path: string, typeName: string, type?: "default" | "namespace" | "direct"): void;
	getDefinition(
		customProperties?: readonly PropertyAssignment[]
	): readonly [ObjectLiteralExpression] | readonly [];
}

/**
 * @deprecated
 */
export type DataParserCheckers = (
	| DP.DataParserChecker
	| DP.DataParserCheckerArrayMax
	| DP.DataParserCheckerArrayMin
	| DP.DataParserCheckerBigIntMax
	| DP.DataParserCheckerBigIntMin
	| DP.DataParserCheckerNumberMax
	| DP.DataParserCheckerNumberMin
	| DP.DataParserCheckerInt
	| DP.DataParserCheckerStringMax
	| DP.DataParserCheckerStringMin
	| DP.DataParserCheckerEmail
	| DP.DataParserCheckerRegex
	| DP.DataParserCheckerUrl
	| DP.DataParserCheckerUuid
	| DP.DataParserCheckerRefine
	| DP.DataParserCheckerTimeMin
	| DP.DataParserCheckerTimeMax
);

export type CheckerTransformerBuildFunction<
	GenericChecker extends DataParserCheckers = DataParserCheckers,
> = (
	checker: GenericChecker,
	params: CheckerTransformerParams,
) => CheckerTransformerEither;

export function createCheckerTransformer<
	GenericChecker extends DataParserCheckers,
>(
	support: (checker: DataParserCheckers) => checker is GenericChecker,
	builder: CheckerTransformerBuildFunction<GenericChecker>,
) {
	return (
		checker: DataParserCheckers,
		params: CheckerTransformerParams,
	): CheckerTransformerEither => support(checker)
		? builder(
			checker as GenericChecker,
			params,
		)
		: E.left("checkerNotSupport", checker);
}
