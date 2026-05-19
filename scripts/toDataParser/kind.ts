import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsDataParserToolsToDataParser: true;
	}
}

export const createToDataParserKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsDataParserToolsToDataParser",
);
