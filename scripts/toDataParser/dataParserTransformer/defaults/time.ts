import { A, DP, E, pipe } from "@duplojs/utils";
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
			addImport,
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

		if (A.minElements(dataParser.definition.checkers, 1)) {
			addImport("@duplojs/utils/date", "DDate", "clause");
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
