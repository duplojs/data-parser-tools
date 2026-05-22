import { pipe, G, A, P, isType } from "@duplojs/utils";
import type { MapImportContext } from "./create";
import { factory, SyntaxKind } from "typescript";

export function createImportDeclaration(importContext: MapImportContext) {
	return pipe(
		importContext,
		G.map(
			([path, types]) => P.match(types)
				.when(
					isType("array"),
					(identifiers) => factory.createImportDeclaration(
						undefined,
						factory.createImportClause(
							SyntaxKind.TypeKeyword,
							undefined,
							factory.createNamedImports(
								A.map(
									identifiers,
									(identifier) => factory.createImportSpecifier(
										false,
										undefined,
										factory.createIdentifier(identifier),
									),
								),
							),
						),
						factory.createStringLiteral(path),
						undefined,
					),
				)
				.with(
					{ type: "clause" },
					({ identifier }) => factory.createImportDeclaration(
						undefined,
						factory.createImportClause(
							undefined,
							undefined,
							factory.createNamespaceImport(factory.createIdentifier(identifier)),
						),
						factory.createStringLiteral(path),
						undefined,
					),
				)
				.with(
					{ type: "default" },
					({ identifier }) => factory.createImportDeclaration(
						undefined,
						factory.createImportClause(
							undefined,
							factory.createIdentifier(identifier),
							undefined,
						),
						factory.createStringLiteral(path),
						undefined,
					),
				)
				.exhaustive(),
		),
	);
}
