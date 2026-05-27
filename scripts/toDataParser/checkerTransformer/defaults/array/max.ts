import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerArrayMaxTransformer = createCheckerTransformer(
	DP.checkerArrayMaxKind.has,
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
				factory.createIdentifier("checkerArrayMax"),
			),
			undefined,
			[
				factory.createNumericLiteral(checker.definition.max),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
