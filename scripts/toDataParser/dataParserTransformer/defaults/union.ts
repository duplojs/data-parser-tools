import { A, DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { type Expression, factory } from "typescript";

export const unionTransformer = createTransformer(
	DP.unionKind.has,
	(
		dataParser,
		{
			dependencyIdentifier,
			getDefinition,
			success,
			transformer,
		},
	) => {
		const options = A.reduce(
			dataParser.definition.options,
			A.reduceFrom<Expression[]>([]),
			({ element, lastValue, nextPush, exit }) => {
				const result = transformer(element);

				if (E.isLeft(result)) {
					return exit(result);
				}

				return nextPush(lastValue, unwrap(result));
			},
		);

		if (E.isLeft(options)) {
			return options;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("union"),
				),
				undefined,
				[
					factory.createArrayLiteralExpression(
						options,
						true,
					),
					...definition,
				],
			),
			success,
		);
	},
);
