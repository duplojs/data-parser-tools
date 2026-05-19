import { DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const nullableTransformer = createTransformer(
	DP.nullableKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const inner = transformer(dataParser.definition.inner);

		if (E.isLeft(inner)) {
			return inner;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("nullable"),
				),
				undefined,
				[
					unwrap(inner),
					...definition,
				],
			),
			success,
		);
	},
);
