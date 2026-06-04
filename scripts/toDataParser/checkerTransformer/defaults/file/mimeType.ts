import { SDP } from "@duplojs/server-utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerFileMimeTypeTransformer = createCheckerTransformer(
	SDP.checkerFileMimeTypeKind.has,
	(
		checker,
		{
			success,
			getDefinition,
			addImport,
		},
	) => {
		addImport("@duplojs/server-utils/dataParser", "SDP", "namespace");

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("SDP"),
				factory.createIdentifier("checkerFileMimeType"),
			),
			undefined,
			[
				factory.createRegularExpressionLiteral(
					`/${checker.definition.mimeType.source}/${checker.definition.mimeType.flags}`,
				),
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
