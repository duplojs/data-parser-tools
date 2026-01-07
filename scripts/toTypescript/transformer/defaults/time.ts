import { DP } from "@duplojs/utils";
import { factory, SyntaxKind } from "typescript";
import { createTransformer } from "../create";

export const timeTransformer = createTransformer(
	DP.timeKind.has,
	(
		__schema,
		{ success },
	) => success(
		factory.createTemplateLiteralType(
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
		),
	),
);
