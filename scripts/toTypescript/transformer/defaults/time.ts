import { DP, P } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

const theTime = factory.createTypeReferenceNode(
	factory.createIdentifier("TheTime"),
);

const serializedTheTime = factory.createTypeReferenceNode(
	factory.createIdentifier("SerializedTheTime"),
);

const number = factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);

export const timeTransformer = createTransformer(
	DP.timeKind.has,
	(
		__schema,
		{
			mode,
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/utils/date", "TheTime");

		return P.match(mode)
			.with(
				"out",
				() => success(theTime),
			)
			.with(
				"in",
				() => {
					addImport("@duplojs/utils/date", "SerializedTheTime");

					return success(
						factory.createUnionTypeNode([
							serializedTheTime,
							number,
							theTime,
						]),
					);
				},
			)
			.exhaustive();
	},
);
