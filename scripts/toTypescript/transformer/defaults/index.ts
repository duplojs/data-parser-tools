export * from "./array";
export * from "./bigint";
export * from "./boolean";
export * from "./empty";
export * from "./lazy";
export * from "./literal";
export * from "./nil";
export * from "./nullable";
export * from "./number";
export * from "./object";
export * from "./optional";
export * from "./pipe";
export * from "./record";
export * from "./recover";
export * from "./string";
export * from "./templateLiteral";
export * from "./transform";
export * from "./tuple";
export * from "./union";
export * from "./unknown";

import { type createTransformer } from "../create";
import { arrayTransformer } from "./array";
import { bigIntTransformer } from "./bigint";
import { booleanTransformer } from "./boolean";
import { emptyTransformer } from "./empty";
import { lazyTransformer } from "./lazy";
import { literalTransformer } from "./literal";
import { nilTransformer } from "./nil";
import { nullableTransformer } from "./nullable";
import { numberTransformer } from "./number";
import { objectTransformer } from "./object";
import { optionalTransformer } from "./optional";
import { pipeTransformer } from "./pipe";
import { recordTransformer } from "./record";
import { recoverTransformer } from "./recover";
import { stringTransformer } from "./string";
import { templateLiteralTransformer } from "./templateLiteral";
import { transformTransformer } from "./transform";
import { tupleTransformer } from "./tuple";
import { unionTransformer } from "./union";
import { unknownTransformer } from "./unknown";

export const defaultTransformers = [
	arrayTransformer,
	bigIntTransformer,
	booleanTransformer,
	emptyTransformer,
	lazyTransformer,
	literalTransformer,
	nilTransformer,
	nullableTransformer,
	numberTransformer,
	objectTransformer,
	optionalTransformer,
	pipeTransformer,
	recordTransformer,
	recoverTransformer,
	stringTransformer,
	templateLiteralTransformer,
	transformTransformer,
	tupleTransformer,
	unionTransformer,
	unknownTransformer,
] as const satisfies readonly ReturnType<typeof createTransformer>[];
