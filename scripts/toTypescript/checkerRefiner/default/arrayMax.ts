import { DP } from "@duplojs/utils";
import { createCheckerRefiner } from "../create";
import { factory } from "typescript";

export const arrayMaxCheckerRefiner = createCheckerRefiner(
	DP.checkerArrayMaxKind.has,
	(checker, currentTypeNode, { success, addImport }) => {
		addImport("@duplojs/utils/array", "MaxElements", "direct");

		return success(
			factory.createTypeReferenceNode(
				factory.createIdentifier("MaxElements"),
				[
					factory.createLiteralTypeNode(
						factory.createNumericLiteral(checker.definition.max.toString()),
					),
				],
			),
		);
	},
);
