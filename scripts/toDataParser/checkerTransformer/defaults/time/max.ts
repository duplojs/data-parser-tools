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
			addImport,
		},
	) => {
		addImport("@duplojs/utils/date", "D", "namespace");

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("DP"),
				factory.createIdentifier("checkerTimeMax"),
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
