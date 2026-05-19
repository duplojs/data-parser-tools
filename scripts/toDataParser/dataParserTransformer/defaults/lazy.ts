import { DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, SyntaxKind } from "typescript";

export const lazyTransformer = createTransformer(
	DP.lazyKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const getter = transformer(dataParser.definition.getter.value);

		if (E.isLeft(getter)) {
			return getter;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("lazy"),
				),
				undefined,
				[
					factory.createArrowFunction(
						undefined,
						undefined,
						[],
						undefined,
						factory.createToken(SyntaxKind.EqualsGreaterThanToken),
						unwrap(getter),
					),
					...definition,
				],
			),
			success,
		);
	},
);
