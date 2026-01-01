import { DP } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const dateTransformer = createTransformer(
	DP.dateKind.has,
	(
		__schema,
		{ success },
	) => success(
		factory.createTemplateLiteralType(
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
		),
	),
);
