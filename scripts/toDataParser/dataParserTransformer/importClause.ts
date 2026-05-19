import { G } from "@duplojs/utils";
import type { MapImportClause } from "./create";
import { factory } from "typescript";

export function importClauseTransformer(imports: MapImportClause) {
	return G.map(
		imports,
		([path, clause]) => factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				undefined,
				undefined,
				factory.createNamespaceImport(factory.createIdentifier(clause)),
			),
			factory.createStringLiteral(path),
			undefined,
		),
	);
}
