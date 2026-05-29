import { DPE, DP } from "@duplojs/utils";
import { createResearcher } from "@scripts/finder/researcher";

describe("createResearcher", () => {
	it("calls the researcher when the predicate matches", () => {
		const schema = DPE.string();
		const researcher = vi.fn();
		const createdResearcher = createResearcher(
			DP.stringKind.has,
			researcher,
		);

		createdResearcher(
			schema,
			{
				find: vi.fn(),
			},
		);

		expect(researcher).toHaveBeenCalledOnce();
		expect(researcher).toHaveBeenCalledWith(
			schema,
			expect.objectContaining({
				find: expect.any(Function),
			}),
		);
	});

	it("does not call the researcher when the predicate does not match", () => {
		const researcher = vi.fn();
		const createdResearcher = createResearcher(
			DP.stringKind.has,
			researcher,
		);

		createdResearcher(
			DPE.number(),
			{
				find: vi.fn(),
			},
		);

		expect(researcher).not.toHaveBeenCalled();
	});
});
