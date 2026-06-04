import { SDP } from "@duplojs/server-utils";
import { createCheckerTransformer } from "../../create";
import { factory, type PropertyAssignment } from "typescript";

export const checkerFileSizeTransformer = createCheckerTransformer(
	SDP.checkerFileSizeKind.has,
	(
		checker,
		{
			success,
			getDefinition,
			addImport,
		},
	) => {
		addImport("@duplojs/server-utils/dataParser", "SDP", "namespace");

		const checkerFileSizeParams: PropertyAssignment[] = [];

		if (checker.definition.min !== undefined) {
			checkerFileSizeParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("min"),
					factory.createNumericLiteral(checker.definition.min),
				),
			);
		}

		if (checker.definition.max !== undefined) {
			checkerFileSizeParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("max"),
					factory.createNumericLiteral(checker.definition.max),
				),
			);
		}

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("SDP"),
				factory.createIdentifier("checkerFileSize"),
			),
			undefined,
			[
				factory.createObjectLiteralExpression(checkerFileSizeParams),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
