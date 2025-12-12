import { DP } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const booleanTransformer = createTransformer(
	DP.booleanKind.has,
	(
		__schema,
		{ success },
	) => success(factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword)),
);
