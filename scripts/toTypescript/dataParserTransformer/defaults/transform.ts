import { DP, P } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const transformTransformer = createTransformer(
	DP.transformKind.has,
	(
		schema,
		{
			transformer,
			success,
			mode,
		},
	) => P.match(mode)
		.with(
			"in",
			() => transformer(schema.definition.inner),
		)
		.with(
			"out",
			() => success(factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword)),
		)
		.exhaustive(),
);
