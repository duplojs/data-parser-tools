import { A, DP, E, isType, P, pipe, pipeCall, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { type Expression, factory } from "typescript";

export const templateLiteralTransformer = createTransformer(
	DP.templateLiteralKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const parts = A.reduce(
			dataParser.definition.template,
			A.reduceFrom<Expression[]>([]),
			({ element, lastValue, nextPush, exit }) => {
				if (DP.dataParserKind.has(element)) {
					const transformResult = transformer(element);

					if (E.isLeft(transformResult)) {
						return exit(transformResult);
					}

					return nextPush(lastValue, unwrap(transformResult));
				}

				const result = P.match(element)
					.when(
						isType("bigint"),
						(value) => factory.createBigIntLiteral(`${value.toString()}n`),
					)
					.when(
						isType("boolean"),
						(value) => value
							? factory.createTrue()
							: factory.createFalse(),
					)
					.when(
						isType("string"),
						pipeCall(factory.createStringLiteral),
					)
					.when(
						isType("number"),
						pipeCall(factory.createNumericLiteral),
					)
					.when(
						isType("null"),
						() => factory.createNull(),
					)
					.when(
						isType("undefined"),
						() => factory.createIdentifier("undefined"),
					)
					.exhaustive();

				return nextPush(lastValue, result);
			},
		);

		if (E.isLeft(parts)) {
			return parts;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("templateLiteral"),
				),
				undefined,
				[
					factory.createArrayLiteralExpression(parts),
					...definition,
				],
			),
			success,
		);
	},
);
