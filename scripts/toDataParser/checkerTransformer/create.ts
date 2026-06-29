import type { CallExpression, Identifier, ObjectLiteralExpression, PropertyAssignment } from "typescript";
import { type DP, E } from "@duplojs/utils";
import type * as TST from "@scripts/toTypescript";

export type CheckerTransformerSuccessEither = E.Right<"buildSuccess", CallExpression | Identifier>;

export type CheckerTransformerCheckerNotSupportedEither = E.Left<"checkerNotSupport", DP.DataParserCheckers>;

export type CheckerTransformerBuildErrorEither = E.Left<"buildCheckerError", DP.DataParserCheckers>;

export type CheckerTransformerEither =
	| CheckerTransformerSuccessEither
	| CheckerTransformerCheckerNotSupportedEither
	| CheckerTransformerBuildErrorEither;

export interface CheckerTransformerParams {
	readonly importContext: TST.MapImportContext;

	success(
		result: CallExpression | Identifier,
	): CheckerTransformerSuccessEither;
	buildError(): CheckerTransformerBuildErrorEither;
	addImport(path: string, typeName: string, type?: "default" | "namespace" | "direct"): void;
	getDefinition(
		customProperties?: readonly PropertyAssignment[]
	): readonly [ObjectLiteralExpression] | readonly [];
}

export type CheckerTransformerBuildFunction<
	GenericChecker extends DP.DataParserCheckers = DP.DataParserCheckers,
> = (
	checker: GenericChecker,
	params: CheckerTransformerParams,
) => CheckerTransformerEither;

export function createCheckerTransformer<
	GenericChecker extends DP.DataParserCheckers,
>(
	support: (checker: DP.DataParserCheckers) => checker is GenericChecker,
	builder: CheckerTransformerBuildFunction<GenericChecker>,
) {
	return (
		checker: DP.DataParserCheckers,
		params: CheckerTransformerParams,
	): CheckerTransformerEither => support(checker)
		? builder(
			checker as GenericChecker,
			params,
		)
		: E.left("checkerNotSupport", checker);
}
