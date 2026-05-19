import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerTimeMaxTransformer = createCheckerTransformer(
	DP.checkerTimeMaxKind.has,
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
				factory.createIdentifier("checkerTimeMax"),
			),
			undefined,
			[
				factory.createCallExpression(
					factory.createPropertyAccessExpression(
						factory.createIdentifier("DDate"),
						factory.createIdentifier("createTime"),
					),
					undefined,
					[
						factory.createNumericLiteral(checker.definition.max.toNative()),
						factory.createStringLiteral("millisecond"),
					],
				),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
