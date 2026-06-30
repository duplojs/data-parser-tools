import { type createCheckerRefiner } from "../create";
import { arrayMaxCheckerRefiner } from "./arrayMax";
import { arrayMinCheckerRefiner } from "./arrayMin";
import { emailCheckerRefiner } from "./email";

export * from "./email";
export * from "./arrayMin";
export * from "./arrayMax";

export const defaultCheckerRefiners = [
	emailCheckerRefiner,
	arrayMinCheckerRefiner,
	arrayMaxCheckerRefiner,
] as const satisfies readonly ReturnType<typeof createCheckerRefiner>[];
