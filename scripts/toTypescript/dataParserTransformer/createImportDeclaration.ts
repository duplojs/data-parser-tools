import { A } from "@duplojs/utils";
import type { MapImportContext } from "./create";
import { factory, type ImportDeclaration } from "typescript";

export function createImportDeclaration(importContext: MapImportContext) {
	return A.reduce(
		A.from(importContext),
		A.reduceFrom<ImportDeclaration[]>([]),
		({ element: [path, imports], lastValue, next }) => {
			const declarations = A.concat(
				lastValue,
				A.map(
					imports.namespace ?? [],
					(identifier) => factory.createImportDeclaration(
						undefined,
						factory.createImportClause(
							undefined,
							undefined,
							factory.createNamespaceImport(factory.createIdentifier(identifier)),
						),
						factory.createStringLiteral(path),
						undefined,
					),
				),
				A.map(
					imports.default ?? [],
					(identifier) => factory.createImportDeclaration(
						undefined,
						factory.createImportClause(
							undefined,
							factory.createIdentifier(identifier),
							undefined,
						),
						factory.createStringLiteral(path),
						undefined,
					),
				),
				imports.direct?.length
					? [
						factory.createImportDeclaration(
							undefined,
							factory.createImportClause(
								undefined,
								undefined,
								factory.createNamedImports(
									A.map(
										imports.direct,
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
					]
					: [],
			);

			return next(
				declarations,
			);
		},
	);
}
