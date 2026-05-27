import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory, type PropertyAssignment } from "typescript";

export const checkerNumberMinTransformer = createCheckerTransformer(
	DP.checkerNumberMinKind.has,
	(
		checker,
		{
			success,
			getDefinition,
		},
	) => {
		const checkerDefinition: PropertyAssignment[] = [];

		if (checker.definition.exclusive) {
			checkerDefinition.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("exclusive"),
					factory.createTrue(),
				),
			);
		}

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("DP"),
				factory.createIdentifier("checkerNumberMin"),
			),
			undefined,
			[
				factory.createNumericLiteral(checker.definition.min),
				...getDefinition(checkerDefinition),
			],
		);

		return success(expression);
	},
);
