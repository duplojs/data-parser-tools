import { DP } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const bigIntTransformer = createTransformer(
	DP.bigIntKind.has,
	(
		__schema,
		{ success },
	) => success(factory.createKeywordTypeNode(SyntaxKind.BigIntKeyword)),
);
