import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerRegexTransformer = createCheckerTransformer(
	DP.checkerRegexKind.has,
	(
		checker,
		{
			success,
			getDefinition,
		},
	) => {
		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("DP"),
				factory.createIdentifier("checkerRegex"),
			),
			undefined,
			[
				factory.createRegularExpressionLiteral(
					`/${checker.definition.regex.source}/${checker.definition.regex.flags}`,
				),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);

DP.checkerRegex(/^/);
