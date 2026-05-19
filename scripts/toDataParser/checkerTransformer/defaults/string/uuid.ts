import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerUuidTransformer = createCheckerTransformer(
	DP.checkerUuidKind.has,
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
				factory.createIdentifier("checkerUuid"),
			),
			undefined,
			getDefinition(),
		);

		return success(expression);
	},
);
