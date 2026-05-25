import { expect } from "vitest";

function areSetsEqual(AA: unknown, BB: unknown): boolean | undefined {
	if (!(AA instanceof Set) && !(BB instanceof Set)) {
		return undefined;
	}

	if (!(AA instanceof Set) || !(BB instanceof Set)) {
		return false;
	}

	if (AA.size !== BB.size) {
		return false;
	}

	expect([...AA]).toStrictEqual([...BB]);

	return true;
}

expect.addEqualityTesters([areSetsEqual]);
