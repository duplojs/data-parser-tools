import { DP, E, innerPipe, pipe } from "@duplojs/utils";
import { factory } from "typescript";
import { createTransformer } from "../create";

export const arrayTransformer = createTransformer(
	DP.arrayKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => pipe(
		schema.definition.element,
		transformer,
		E.whenIsRight(
			innerPipe(
				factory.createArrayTypeNode,
				success,
			),
		),
	),
);
