import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsDataParserToolsToJsonSchema: true;
	}
}

export const createToJsonSchemaKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsDataParserToolsToJsonSchema",
);
