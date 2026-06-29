import { render, defaultTransformers } from "@scripts/toTypescript";
import { DPE } from "@duplojs/utils";

describe("object", () => {
	it("optional detection by mode", () => {
		const schema = DPE.object({
			optionalOut: DPE.optional(DPE.string()),
			coalesced: DPE.optional(DPE.number(), { coalescingValue: 99 }),
			empty: DPE.empty(),
			literalUndefined: DPE.literal(["value", undefined]),
			unionWithOptional: DPE.union([DPE.number(), DPE.optional(DPE.string())]),
			pipeToRequired: DPE.pipe(DPE.optional(DPE.string()), DPE.number()),
			recoverUndefined: DPE.recover(DPE.boolean(), false),
			transformOptional: DPE.transform(
				DPE.optional(DPE.string()),
				(value: string | undefined) => value ?? "",
			),
			lazyOptional: DPE.lazy(() => DPE.optional(DPE.number())),
			required: DPE.string(),
		});

		expect(
			render(
				schema,
				{
					identifier: "ObjectOut",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "ObjectIn",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();
	});
});
