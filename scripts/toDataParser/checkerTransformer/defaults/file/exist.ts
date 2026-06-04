import { SDP } from "@duplojs/server-utils";
import { createCheckerTransformer } from "../../create";
import { factory } from "typescript";

export const checkerFileExistTransformer = createCheckerTransformer(
	SDP.checkerFileExistKind.has,
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
				factory.createIdentifier("checkerFileExist"),
			),
			undefined,
			getDefinition(),
		);

		return success(expression);
	},
);
