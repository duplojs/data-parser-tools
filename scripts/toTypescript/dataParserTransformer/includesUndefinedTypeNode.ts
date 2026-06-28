import { A } from "@duplojs/utils";
import { isUnionTypeNode, SyntaxKind, type TypeNode } from "typescript";

export function includesUndefinedTypeNode(typeNode: TypeNode): boolean {
	if (typeNode.kind === SyntaxKind.UndefinedKeyword) {
		return true;
	}

	if (isUnionTypeNode(typeNode)) {
		return A.some(
			typeNode.types,
			(subTypeNode) => includesUndefinedTypeNode(subTypeNode),
		);
	}

	return false;
}
