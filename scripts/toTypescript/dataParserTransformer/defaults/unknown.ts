import { DP } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const unknownTransformer = createTransformer(
	DP.unknownKind.has,
	(
		__schema,
		{ success },
	) => success(factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword)),
);
