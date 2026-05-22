import { A, DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { type Expression, factory } from "typescript";

export const tupleTransformer = createTransformer(
	DP.tupleKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const shape = A.reduce(
			dataParser.definition.shape,
			A.reduceFrom<Expression[]>([]),
			({ element, lastValue, nextPush, exit }) => {
				const result = transformer(element);

				if (E.isLeft(result)) {
					return exit(result);
				}

				return nextPush(lastValue, unwrap(result));
			},
		);

		if (E.isLeft(shape)) {
			return shape;
		}

		const rest = dataParser.definition.rest
			? pipe(
				dataParser.definition.rest,
				transformer,
				E.whenIsRight(
					(expression) => [
						factory.createPropertyAssignment(
							factory.createIdentifier("rest"),
							expression,
						),
					],
				),
			)
			: undefined;

		if (E.isLeft(rest)) {
			return rest;
		}

		const definition = getDefinition(rest);

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("tuple"),
				),
				undefined,
				[
					factory.createArrayLiteralExpression(
						shape,
						A.minElements(shape, 3),
					),
					...definition,
				],
			),
			success,
		);
	},
);
