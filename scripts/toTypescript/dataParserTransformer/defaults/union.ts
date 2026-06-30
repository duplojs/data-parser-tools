import { A, DP, E, innerPipe, isType, pipe, when } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, type TypeNode } from "typescript";

export const unionTransformer = createTransformer(
	DP.unionKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => pipe(
		schema.definition.options,
		A.reduce(
			A.reduceFrom<TypeNode[]>([]),
			({ element, lastValue, next, exit }) => pipe(
				transformer(element),
				when(
					E.isLeft,
					exit,
				),
				E.whenIsRight(
					(node) => next(A.push(lastValue, node)),
				),
			),
		),
		when(
			isType("array"),
			innerPipe(
				factory.createUnionTypeNode,
				success,
			),
		),
	),
);
