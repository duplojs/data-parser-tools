import { DP, E, pipe, P } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const optionalTransformer = createTransformer(
	DP.optionalKind.has,
	(
		schema,
		{
			transformer,
			mode,
			success,
		},
	) => pipe(
		schema.definition.inner,
		transformer,
		E.whenIsRight(
			(innerType) => pipe(
				mode,
				P.match(
					"in",
					() => factory.createUnionTypeNode(
						[
							innerType,
							factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
						],
					),
				),
				P.match(
					"out",
					() => innerType,
				),
				P.exhaustive,
				success,
			),
		),
	),
);

