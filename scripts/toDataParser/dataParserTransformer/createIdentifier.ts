import { S } from "@duplojs/utils";

export function createIdentifier(identifier: string) {
	return `${S.uncapitalize(identifier)}DataParser`;
}
