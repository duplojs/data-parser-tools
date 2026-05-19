import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerEmailTransformer = createCheckerTransformer(
	DP.checkerEmailKind.has,
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
				factory.createIdentifier("checkerEmail"),
			),
			undefined,
			getDefinition(),
		);

		return success(expression);
	},
);
