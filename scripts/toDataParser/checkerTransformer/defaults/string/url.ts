import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory, type PropertyAssignment } from "typescript";

export const checkerUrlTransformer = createCheckerTransformer(
	DP.checkerUrlKind.has,
	(
		checker,
		{
			success,
			getDefinition,
		},
	) => {
		const checkerDefinition: PropertyAssignment[] = [];

		if (checker.definition.hostname) {
			checkerDefinition.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("hostname"),
					factory.createRegularExpressionLiteral(
						`/${checker.definition.hostname.source}/${checker.definition.hostname.flags}`,
					),
				),
			);
		}

		if (checker.definition.normalize) {
			checkerDefinition.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("normalize"),
					factory.createTrue(),
				),
			);
		}

		if (checker.definition.protocol) {
			checkerDefinition.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("protocol"),
					factory.createRegularExpressionLiteral(
						`/${checker.definition.protocol.source}/${checker.definition.protocol.flags}`,
					),
				),
			);
		}

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("DP"),
				factory.createIdentifier("checkerUrl"),
			),
			undefined,
			getDefinition(checkerDefinition),
		);

		return success(expression);
	},
);
