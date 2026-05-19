import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerArrayMinTransformer = createCheckerTransformer(
	DP.checkerArrayMinKind.has,
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
				factory.createIdentifier("checkerArrayMin"),
			),
			undefined,
			[
				factory.createNumericLiteral(checker.definition.min),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
