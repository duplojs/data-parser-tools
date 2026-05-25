import { A } from "@duplojs/utils";
import type { MapImportContext } from "./create";

export function createAddImport(importContext: MapImportContext) {
	return (
		path: string,
		typeName: string,
		type?: "default" | "namespace" | "direct",
	) => {
		const importKind = type === undefined
			? "direct"
			: type;
		const imports = importContext.get(path) ?? {};
		const identifiers = imports[importKind] ?? [];

		if (!A.includes(identifiers, typeName)) {
			importContext.set(
				path,
				{
					...imports,
					[importKind]: A.push(identifiers, typeName),
				},
			);
		}
	};
}
