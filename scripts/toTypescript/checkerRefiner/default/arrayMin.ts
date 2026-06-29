import { A, DP, pipe } from "@duplojs/utils";
import { createCheckerRefiner } from "../create";
import { factory, isArrayTypeNode } from "typescript";

export const arrayMinCheckerRefiner = createCheckerRefiner(
	DP.checkerArrayMinKind.has,
	(checker, currentTypeNode, { success, buildError }) => isArrayTypeNode(currentTypeNode)
		? success(
			pipe(
				Array.from({ length: checker.definition.min }),
				A.fillAll(currentTypeNode.elementType),
				(result) => factory.createTupleTypeNode([
					...result,
					factory.createRestTypeNode(
						currentTypeNode,
					),
				]),
			),
		)
		: buildError(),
);
