import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerBigIntMinTransformer = createCheckerTransformer(
	DP.checkerBigIntMinKind.has,
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
				factory.createIdentifier("checkerBigIntMin"),
			),
			undefined,
			[
				factory.createBigIntLiteral(`${checker.definition.min.toString()}n`),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
