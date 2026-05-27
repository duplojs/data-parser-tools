import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerIntTransformer = createCheckerTransformer(
	DP.checkerIntKind.has,
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
				factory.createIdentifier("checkerInt"),
			),
			undefined,
			getDefinition(),
		);

		return success(expression);
	},
);
