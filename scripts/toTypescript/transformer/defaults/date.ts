import { DP, P } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

const theDate = factory.createTypeReferenceNode(
	factory.createIdentifier("TheDate"),
);

const serializedTheDate = factory.createTemplateLiteralType(
	factory.createTemplateHead(
		"date",
		"date",
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

const nativeDate = factory.createTypeReferenceNode(
	factory.createIdentifier("Date"),
	undefined,
);

export const dateTransformer = createTransformer(
	DP.dateKind.has,
	(
		__schema,
		{
			mode,
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/utils/date", "TheDate");

		return P.match(mode)
			.with(
				"out",
				() => success(serializedTheDate),
			)
			.with(
				"in",
				() => success(
					factory.createUnionTypeNode([
						theDate,
						nativeDate,
						serializedTheDate,
					]),
				),
			)
			.exhaustive();
	},
);
