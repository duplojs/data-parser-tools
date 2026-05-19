import { DP, E, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const unknownTransformer = createTransformer(
	DP.unknownKind.has,
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
					factory.createIdentifier("unknown"),
				),
				undefined,
				definition,
			),
			success,
		);
	},
);
