import { DP, P, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, SyntaxKind } from "typescript";

export const recoverTransformer = createTransformer(
	DP.recoverKind.has,
	(
		{ definition: { inner } },
		{
			transformer,
			success,
			mode,
		},
	) => pipe(
		mode,
		P.match(
			"in",
			() => success(factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword)),
		),
		P.match(
			"out",
			() => transformer(inner),
		),
		P.exhaustive,
	),
);
