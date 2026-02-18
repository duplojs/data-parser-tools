import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toTypescript";
import { factory } from "typescript";

describe("override type node", () => {
	it("simple change", () => {
		expect(
			render(
				DPE.boolean().addOverrideTypeNode(factory.createTypeReferenceNode("Date")),
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("mode in", () => {
		const schema = DPE.boolean().addOverrideTypeNode({ in: factory.createTypeReferenceNode("Date") });
		expect(
			render(
				schema,
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("out", () => {
		const schema = DPE.object({ date: DPE.boolean().addOverrideTypeNode({ out: factory.createTypeReferenceNode("Date") }) });
		expect(
			render(
				schema,
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "in",
				},
			),
		).toMatchSnapshot();

		expect(
			render(
				schema,
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
