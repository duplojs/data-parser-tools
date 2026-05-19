import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerStringMaxTransformer = createCheckerTransformer(
	DP.checkerStringMaxKind.has,
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
				factory.createIdentifier("checkerStringMax"),
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
