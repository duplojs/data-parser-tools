import { DP } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, SyntaxKind } from "typescript";

export const stringTransformer = createTransformer(
	DP.stringKind.has,
	(
		__schema,
		{ success },
	) => success(factory.createKeywordTypeNode(SyntaxKind.StringKeyword)),
);
