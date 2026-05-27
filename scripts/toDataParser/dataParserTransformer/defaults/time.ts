import { DP, E, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const timeTransformer = createTransformer(
	DP.timeKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
		},
	) => {
		const definition = getDefinition(
			dataParser.definition.coerce
				? [
					factory.createPropertyAssignment(
						factory.createIdentifier("coerce"),
						factory.createTrue(),
					),
				]
				: undefined,
		);

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("time"),
				),
				undefined,
				definition,
			),
			success,
		);
	},
);
