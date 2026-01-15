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
				{
					mode,
					coalescingValue: schema.definition.coalescingValue,
				},
				(value) => P.match(value)
					.with(
						P.union(
							{ mode: "in" },
							{
								mode: "out",
								coalescingValue: undefined,
							},
						),
						() => factory.createUnionTypeNode(
							[
								innerType,
								factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
							],
						),
					)
					.with(
						{ mode: "out" },
						() => innerType,
					)
					.exhaustive(),
				success,
			),
		),
	),
);

