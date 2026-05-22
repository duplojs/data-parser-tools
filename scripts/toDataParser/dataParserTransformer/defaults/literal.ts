import { A, DP, E, isType, P, pipe, pipeCall } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const literalTransformer = createTransformer(
	DP.literalKind.has,
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

		const values = A.map(
			dataParser.definition.value,
			(element) => P.match(element)
				.when(
					isType("string"),
					factory.createStringLiteral,
				)
				.when(
					isType("bigint"),
					(value) => factory.createBigIntLiteral(`${value.toString()}n`),
				)
				.when(
					isType("number"),
					pipeCall(factory.createNumericLiteral),
				)
				.when(
					isType("boolean"),
					(value) => value
						? factory.createTrue()
						: factory.createFalse(),
				)
				.when(
					isType("null"),
					() => factory.createNull(),
				)
				.when(
					isType("undefined"),
					() => factory.createIdentifier("undefined"),
				)
				.exhaustive(),
		);

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("literal"),
				),
				undefined,
				[
					factory.createArrayLiteralExpression(
						values,
						A.minElements(values, 4),
					),
					...definition,
				],
			),
			success,
		);
	},
);
