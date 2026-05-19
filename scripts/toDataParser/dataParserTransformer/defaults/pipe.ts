import { DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory } from "typescript";

export const pipeTransformer = createTransformer(
	DP.pipeKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
		},
	) => {
		const input = transformer(dataParser.definition.input);

		if (E.isLeft(input)) {
			return input;
		}

		const output = transformer(dataParser.definition.output);

		if (E.isLeft(output)) {
			return output;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("pipe"),
				),
				undefined,
				[
					unwrap(input),
					unwrap(output),
					...definition,
				],
			),
			success,
		);
	},
);
