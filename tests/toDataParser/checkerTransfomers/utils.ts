import { createPrinter, createSourceFile, EmitHint, type Identifier, ScriptKind, ScriptTarget, type CallExpression } from "typescript";

export function printExpression(expression: CallExpression | Identifier) {
	const printer = createPrinter();
	const sourceFile = createSourceFile("test.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
	return printer.printNode(EmitHint.Unspecified, expression, sourceFile);
}
