import { DP, E, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const dateTransformer = createTransformer(
	DP.dateKind.has,
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
					factory.createIdentifier("date"),
				),
				undefined,
				definition,
			),
			success,
		);
	},
);
