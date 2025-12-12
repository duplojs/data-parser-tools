import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("hook", () => {
	it("replaces schema and stops further hooks", () => {
		const stopHook = vi.fn(({ output }) => output("stop", DPE.string()));
		const shouldNotRun = vi.fn(({ output, schema }) => output("next", schema));

		const result = render(
			DPE.number(),
			{
				identifier: "HookStop",
				mode: "out",
				transformers: defaultTransformers,
				hooks: [stopHook, shouldNotRun],
			},
		);

		expect(stopHook).toHaveBeenCalledTimes(1);
		expect(shouldNotRun).not.toHaveBeenCalled();
		expect(result).toBe("export type HookStop = string;");
	});

	it("chains hooks with next before transforming", () => {
		const stringSchema = DPE.string();
		const useLessHook = vi.fn(({ output, schema }) => output("next", schema));
		const replaceHook = vi.fn(({ output }) => output("stop", DPE.string()));

		const result = render(
			DPE.number(),
			{
				identifier: "HookNext",
				mode: "out",
				transformers: defaultTransformers,
				hooks: [useLessHook, replaceHook],
			},
		);

		expect(useLessHook).toHaveBeenCalledTimes(1);
		expect(replaceHook).toHaveBeenCalledTimes(1);
		expect(result).toBe("export type HookNext = string;");
	});
});
