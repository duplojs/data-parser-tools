export * from "./number";
export * from "./string";
export * from "./array";

import type { createCheckerTransformer } from "../create";

import { checkerIntTransformer, checkerNumberMaxTransformer, checkerNumberMinTransformer } from "./number";
import { checkerEmailTransformer, checkerRegexTransformer, checkerStringMaxTransformer, checkerStringMinTransformer, checkerUrlTransformer, checkerUuidTransformer } from "./string";
import { checkerArrayMaxTransformer, checkerArrayMinTransformer } from "./array";
import { checkerBigIntMaxTransformer, checkerBigIntMinTransformer } from "./bigint";
import { checkerTimeMaxTransformer, checkerTimeMinTransformer } from "./time";
import { checkerRefineTransformer } from "./refine";

export const defaultCheckerTransformers = [
	checkerRefineTransformer,
	// number
	checkerNumberMaxTransformer,
	checkerNumberMinTransformer,
	checkerIntTransformer,
	// string
	checkerStringMaxTransformer,
	checkerStringMinTransformer,
	checkerEmailTransformer,
	checkerRegexTransformer,
	checkerUuidTransformer,
	checkerUrlTransformer,
	// array
	checkerArrayMaxTransformer,
	checkerArrayMinTransformer,
	// bigint
	checkerBigIntMaxTransformer,
	checkerBigIntMinTransformer,
	// time
	checkerTimeMaxTransformer,
	checkerTimeMinTransformer,
] as const satisfies readonly ReturnType<typeof createCheckerTransformer>[];
