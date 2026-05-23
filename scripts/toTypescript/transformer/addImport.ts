import { A } from "@duplojs/utils";
import type { MapImportContext, MapImportType } from "./create";

/**
 * @deprecated Internal compatibility helper for legacy importType. Use MapImportContext directly.
 */
export function createImportContext(
	importContext?: MapImportContext,
	importType?: MapImportType,
) {
	const newImportContext: MapImportContext = new Map(importContext);

	if (!importType) {
		return newImportContext;
	}

	for (const [path, identifiers] of importType) {
		const currentImports = newImportContext.get(path) ?? {};
		const direct = A.reduce(
			identifiers,
			A.reduceFrom(currentImports.direct ?? []),
			({ element, lastValue, next }) => next(
				A.includes(lastValue, element)
					? lastValue
					: A.push(lastValue, element),
			),
		);

		newImportContext.set(
			path,
			{
				...currentImports,
				direct,
			},
		);
	}

	return newImportContext;
}

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
