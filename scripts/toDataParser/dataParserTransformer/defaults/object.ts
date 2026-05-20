import { A, DP, E, O, pipe, when } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, type PropertyAssignment } from "typescript";

export const objectTransformer = createTransformer(
	DP.objectKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
			indent,
		},
	) => {
		const shape = pipe(
			dataParser.definition.shape,
			O.entries,
			A.reduce(
				A.reduceFrom<PropertyAssignment[]>([]),
				({ element: [identifier, parser], lastValue, nextPush, exit }) => pipe(
					parser,
					transformer,
					when(
						E.isLeft,
						exit,
					),
					E.whenIsRight(
						(result) => nextPush(
							lastValue,
							factory.createPropertyAssignment(
								factory.createIdentifier(identifier),
								result,
							),
						),
					),
				),
			),
		);

		if (E.isLeft(shape)) {
			return shape;
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("object"),
				),
				undefined,
				[
					factory.createObjectLiteralExpression(
						shape,
						indent,
					),
					...definition,
				],
			),
			success,
		);
	},
);
