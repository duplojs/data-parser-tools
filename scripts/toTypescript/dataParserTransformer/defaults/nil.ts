import { DP } from "@duplojs/utils";
import { factory } from "typescript";
import { createTransformer } from "../create";

export const nilTransformer = createTransformer(
	DP.nilKind.has,
	(
		__schema,
		{ success },
	) => success(factory.createLiteralTypeNode(factory.createNull())),
);
