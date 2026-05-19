import { DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const recordTransformer = createTransformer(
	DP.recordKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const key = transformer(dataParser.definition.key);

		if (E.isLeft(key)) {
			return key;
		}

		const value = transformer(dataParser.definition.value);

		if (E.isLeft(value)) {
			return value;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("record"),
				),
				undefined,
				[
					unwrap(key),
					unwrap(value),
					...definition,
				],
			),
			success,
		);
	},
);
