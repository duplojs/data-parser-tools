import { factory, SyntaxKind } from "typescript";

export function getOverrideDeclaration() {
	return [
		factory.createImportDeclaration(
			undefined,
			undefined,
			factory.createStringLiteral("@duplojs/utils/dataParser"),
			undefined,
		),
		factory.createModuleDeclaration(
			[factory.createToken(SyntaxKind.DeclareKeyword)],
			factory.createStringLiteral("@duplojs/utils/dataParser"),
			factory.createModuleBlock([
				factory.createInterfaceDeclaration(
					undefined,
					factory.createIdentifier("DataParserDefinition"),
					undefined,
					undefined,
					[
						factory.createPropertySignature(
							undefined,
							factory.createIdentifier("identifier"),
							factory.createToken(SyntaxKind.QuestionToken),
							factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
						),
					],
				),
			]),
		),
	];
}
