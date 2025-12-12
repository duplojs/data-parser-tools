import { A, DP, E, pipe, unwrap, when } from "@duplojs/utils";
import { factory, type TypeNode } from "typescript";
import { createTransformer } from "../create";

export const tupleTransformer = createTransformer(
	DP.tupleKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => {
		const shapeResult = A.reduce(
			schema.definition.shape,
			A.reduceFrom<TypeNode[]>([]),
			({ element, lastValue, exit, next }) => pipe(
				transformer(element),
				when(
					E.isLeft,
					exit,
				),
				E.whenIsRight(
					(node) => next(A.push(lastValue, node)),
				),
			),
		);

		if (E.isLeft(shapeResult)) {
			return shapeResult;
		}

		if (schema.definition.rest) {
			const restResult = transformer(schema.definition.rest);

			if (E.isLeft(restResult)) {
				return restResult;
			}

			return pipe(
				shapeResult,
				A.push(unwrap(restResult)),
				factory.createTupleTypeNode,
				success,
			);
		}

		return pipe(
			shapeResult,
			factory.createTupleTypeNode,
			success,
		);
	},
);
