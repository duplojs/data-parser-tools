import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerTimeMinTransformer = createCheckerTransformer(
	DP.checkerTimeMinKind.has,
	(
		checker,
		{
			success,
			getDefinition,
			addImport,
		},
	) => {
		addImport("@duplojs/utils/date", "D", "namespace");

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("DP"),
				factory.createIdentifier("checkerTimeMin"),
			),
			undefined,
			[
				factory.createCallExpression(
					factory.createPropertyAccessExpression(
						factory.createIdentifier("D"),
						factory.createIdentifier("createTime"),
					),
					undefined,
					[
						factory.createNumericLiteral(checker.definition.min.toNative()),
						factory.createStringLiteral("millisecond"),
					],
				),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
