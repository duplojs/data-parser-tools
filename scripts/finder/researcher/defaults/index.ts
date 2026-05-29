export * from "./array";
export * from "./lazy";
export * from "./nullable";
export * from "./object";
export * from "./optional";
export * from "./pipe";
export * from "./record";
export * from "./recover";
export * from "./templateLiteral";
export * from "./transform";
export * from "./tuple";
export * from "./union";

import type { createResearcher } from "../create";
import { arrayResearcher } from "./array";
import { lazyResearcher } from "./lazy";
import { nullableResearcher } from "./nullable";
import { objectResearcher } from "./object";
import { optionalResearcher } from "./optional";
import { pipeResearcher } from "./pipe";
import { recordResearcher } from "./record";
import { recoverResearcher } from "./recover";
import { templateLiteralResearcher } from "./templateLiteral";
import { transformResearcher } from "./transform";
import { tupleResearcher } from "./tuple";
import { unionResearcher } from "./union";

export const defaultResearchers = [
	arrayResearcher,
	lazyResearcher,
	nullableResearcher,
	objectResearcher,
	optionalResearcher,
	pipeResearcher,
	recordResearcher,
	recoverResearcher,
	templateLiteralResearcher,
	transformResearcher,
	tupleResearcher,
	unionResearcher,
] as const satisfies readonly ReturnType<typeof createResearcher>[];
