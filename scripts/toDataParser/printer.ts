import { createPrinter, createSourceFile, EmitHint, factory, NodeFlags, ScriptKind, ScriptTarget, SyntaxKind, type VariableStatement } from "typescript";
import { type BuildedContext } from "./buildContext";
import { A, G, pipe, S } from "@duplojs/utils";
import * as TST from "@scripts/toTypescript";
import { getOverrideDeclaration } from "./getOverrideDeclaration";

export function printer(params: BuildedContext) {
	const sourceFile = createSourceFile("print.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
	const printer = createPrinter();

	const dataParserStatements = G.reduce(
		params.context.values(),
		G.reduceFrom<VariableStatement[]>([]),
		({ element: contextValue, lastValue, nextPush }) => nextPush(
			lastValue,
			factory.createVariableStatement(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createVariableDeclarationList(
					[
						factory.createVariableDeclaration(
							contextValue.identifier,
							undefined,
							contextValue.typeIdentifier
								? factory.createTypeReferenceNode(
									factory.createQualifiedName(
										factory.createIdentifier(params.importMode === "extended" ? "DPE" : "DP"),
										factory.createIdentifier(params.importMode === "extended" ? "DataParserExtended" : "DataParser"),
									),
									[
										factory.createTypeReferenceNode(contextValue.typeIdentifier),
										factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
									],
								)
								: undefined,
							contextValue.expression,
						),
					],
					NodeFlags.Const,
				),
			),
		),
	);

	return pipe(
		[
			...TST.createImportDeclaration(params.importContext),
			...(
				params.keepIdentifier
					? getOverrideDeclaration()
					: []
			),
			...params.typescriptContext.values(),
			...dataParserStatements,
		],
		A.map(
			(value) => printer.printNode(
				EmitHint.Unspecified,
				value,
				sourceFile,
			),
		),
		A.join("\n\n"),
		S.trim,
	);
}
