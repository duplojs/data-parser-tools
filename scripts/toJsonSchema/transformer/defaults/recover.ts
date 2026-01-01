import { DP, E } from "@duplojs/utils";
import { createTransformer } from "../create";

export const recoverTransformer = createTransformer(
	DP.recoverKind.has,
	(
		{ definition: { inner } },
		{
			transformer,
			success,
			mode,
		},
	) => {
		const innerResult = transformer(inner);

		if (E.isLeft(innerResult)) {
			return innerResult;
		}

		if (mode === "in") {
			return success({});
		}

		return innerResult;
	},
);
