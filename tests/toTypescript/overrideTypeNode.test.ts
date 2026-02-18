import { DPE } from "@duplojs/utils";
import { defaultTransformers, render } from "@scripts/toTypescript";
import { factory, SyntaxKind } from "typescript";

describe("override type node", () => {
	it("simple change", () => {
		expect(
			render(
				DPE.boolean().addOverrideTypescriptTransformer(factory.createTypeReferenceNode("Date")),
				{
					identifier: "Boolean",
					transformers: defaultTransformers,
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});

	it("mode in", () => {
		const schema = DPE.boolean().addOverrideTypescriptTransformer(
			(dataParser, { success, mode, transformer }) => mode === "in"
				? success(factory.createTypeReferenceNode("Date"))
				: transformer(dataParser),
		);
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
		const schema = DPE.object({
			date: DPE.boolean().addOverrideTypescriptTransformer(
				(dataParser, { success, transformer, mode }) => mode === "out"
					? success(factory.createTypeReferenceNode("Date"))
					: transformer(dataParser),
			),
		});
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
