import { DP, E, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const stringTransformer = createTransformer(
	DP.stringKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
		},
	) => {
		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("string"),
				),
				undefined,
				definition,
			),
			success,
		);
	},
);
