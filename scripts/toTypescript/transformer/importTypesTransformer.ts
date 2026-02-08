import { pipe, G, A } from "@duplojs/utils";
import type { MapImportType } from "./create";
import { factory, SyntaxKind } from "typescript";

export function importTypesTransformer(importTypes: MapImportType) {
	return pipe(
		importTypes,
		G.map(
			([path, types]) => factory.createImportDeclaration(
				undefined,
				factory.createImportClause(
					SyntaxKind.TypeKeyword,
					undefined,
					factory.createNamedImports(
						A.map(
							types,
							(type) => factory.createImportSpecifier(
								false,
								undefined,
								factory.createIdentifier(type),
							),
						),
					),
				),
				factory.createStringLiteral(path),
				undefined,
			),
		),
	);
}
