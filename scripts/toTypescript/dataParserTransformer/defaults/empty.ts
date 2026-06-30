import { DP } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const emptyTransformer = createTransformer(
	DP.emptyKind.has,
	(
		__schema,
		{ success },
	) => success(factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)),
);
