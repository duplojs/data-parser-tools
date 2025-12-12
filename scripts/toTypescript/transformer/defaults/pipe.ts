import { DP, P, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";

export const pipeTransformer = createTransformer(
	DP.pipeKind.has,
	(
		{ definition: { input, output } },
		{
			transformer,
			mode,
		},
	) => pipe(
		mode,
		P.match("in", () => input),
		P.match("out", () => output),
		P.exhaustive,
		transformer,
	),
);
