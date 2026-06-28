import { DP } from "@duplojs/utils";
import { createCheckerRefiner } from "../create";
import { factory, SyntaxKind } from "typescript";

export const emailCheckerRefiner = createCheckerRefiner(
	DP.checkerEmailKind.has,
	(checker, currentTypeNode, { success }) => success(
		factory.createTemplateLiteralType(
			factory.createTemplateHead(
				"",
				"",
			),
			[
				factory.createTemplateLiteralTypeSpan(
					factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
					factory.createTemplateMiddle(
						"@",
						"@",
					),
				),
				factory.createTemplateLiteralTypeSpan(
					factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
					factory.createTemplateMiddle(
						".",
						".",
					),
				),
				factory.createTemplateLiteralTypeSpan(
					factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
					factory.createTemplateTail(
						"",
						"",
					),
				),
			],
		),
	),
);
