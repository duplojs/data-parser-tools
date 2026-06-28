import { A, DP, pipe } from "@duplojs/utils";
import { createCheckerRefiner } from "../create";
import { factory } from "typescript";

export const arrayMinCheckerRefiner = createCheckerRefiner(
	DP.checkerArrayMinKind.has,
	(checker, currentTypeNode, { success }) => success(
		pipe(
			Array.from({ length: checker.definition.min }),
			A.fillAll(currentTypeNode),
			(result) => factory.createTupleTypeNode([
				...result,
				factory.createRestTypeNode(
					factory.createArrayTypeNode(
						currentTypeNode,
					),
				),
			]),
		),
	),
);
