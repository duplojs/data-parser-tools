import { DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const arrayTransformer = createTransformer(
	DP.arrayKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const element = transformer(dataParser.definition.element);

		if (E.isLeft(element)) {
			return element;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("array"),
				),
				undefined,
				[
					unwrap(element),
					...definition,
				],
			),
			success,
		);
	},
);
