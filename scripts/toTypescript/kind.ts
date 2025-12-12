import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsDataParserToolsToTypescript: true;
	}
}

export const createToTypescriptKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsDataParserToolsToTypescript",
);
