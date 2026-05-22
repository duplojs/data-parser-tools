import { createPrinter, createSourceFile, EmitHint, ScriptKind, ScriptTarget } from "typescript";
import { type BuildedContext } from "./buildContext";
import { A, pipe, S } from "@duplojs/utils";
import { createImportDeclaration } from "./transformer";

export function printer(params: BuildedContext) {
	const sourceFile = createSourceFile("print.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
	const printer = createPrinter();

	return pipe(
		[
			...createImportDeclaration(params.importContext),
			...params.context.values(),
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
