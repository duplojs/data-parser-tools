import { DP, P } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

const theTime = factory.createTypeReferenceNode(
	factory.createIdentifier("TheTime"),
);

const serializedTheTime = factory.createTemplateLiteralType(
	factory.createTemplateHead(
		"time",
		"time",
	),
	[
		factory.createTemplateLiteralTypeSpan(
			factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
			factory.createTemplateMiddle(
				"",
				"",
			),
		),
		factory.createTemplateLiteralTypeSpan(
			factory.createUnionTypeNode([
				factory.createLiteralTypeNode(factory.createStringLiteral("-")),
				factory.createLiteralTypeNode(factory.createStringLiteral("+")),
			]),
			factory.createTemplateTail(
				"",
				"",
			),
		),
	],
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
				() => success(serializedTheTime),
			)
			.with(
				"in",
				() => success(
					factory.createUnionTypeNode([
						serializedTheTime,
						number,
						theTime,
					]),
				),
			)
			.exhaustive();
	},
);
