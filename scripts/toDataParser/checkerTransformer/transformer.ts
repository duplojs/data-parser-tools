import { A, E, type DP } from "@duplojs/utils";
import type { CheckerTransformerParams, createCheckerTransformer, CheckerTransformerEither } from "./create";
import { factory, type PropertyAssignment } from "typescript";
import * as TST from "@scripts/toTypescript";

export interface CheckerTransformerFunctionParams {
	readonly transformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly importContext: TST.MapImportContext;
}

export function getCheckerDefinition(checker: DP.DataParserChecker, customProperties?: readonly PropertyAssignment[]) {
	const propertyAssignments: PropertyAssignment[] = [];

	if (checker.definition.errorMessage) {
		propertyAssignments.push(
			factory.createPropertyAssignment(
				factory.createIdentifier("errorMessage"),
				factory.createStringLiteral(checker.definition.errorMessage),
			),
		);
	}

	if (customProperties) {
		propertyAssignments.push(...customProperties);
	}

	return A.minElements(propertyAssignments, 1)
		? <const>[factory.createObjectLiteralExpression(propertyAssignments)]
		: <const>[];
}

export function checkerTransformer(
	checker: DP.DataParserChecker,
	params: CheckerTransformerFunctionParams,
) {
	const functionParams: CheckerTransformerParams = {
		importContext: params.importContext,
		success(result) {
			return E.right("buildSuccess", result);
		},
		buildError() {
			return E.left("buildCheckerError", checker);
		},
		addImport: TST.createAddImport(params.importContext),
		getDefinition(customProperties) {
			return getCheckerDefinition(checker, customProperties);
		},
	};

	return A.reduce(
		params.transformers,
		A.reduceFrom<CheckerTransformerEither>(
			E.left("checkerNotSupport", checker),
		),
		({
			element: functionBuilder,
			lastValue,
			next,
			exit,
		}) => {
			const result = functionBuilder(checker, functionParams);

			if (E.isLeft(result)) {
				if (!E.hasInformation(result, "checkerNotSupport")) {
					return exit(result);
				}

				return next(lastValue);
			}

			return exit(result);
		},
	);
}
