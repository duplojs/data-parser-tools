import { throws } from "node:assert/strict";
import { DP, DPE, E } from "@duplojs/utils";
import {
	DataParserToJsonSchemaRenderError,
	defaultTransformers,
	render,
} from "@scripts/toJsonSchema";

describe("render", () => {
	it("renders jsonSchema202012", () => {
		expect(
			render(
				DPE.string(),
				{
					identifier: "StringSchema",
					transformers: defaultTransformers,
					version: "jsonSchema202012",
				},
			),
		).toMatchSnapshot();
	});

	it("throws when transformation is not supported", () => {
		throws(
			() => render(
				DPE.string(),
				{
					identifier: "UnsupportedSchema",
					transformers: [],
					version: "jsonSchema7",
				},
			),
			(error) => {
				expect(error).toBeInstanceOf(DataParserToJsonSchemaRenderError);
				expect(
					E.hasInformation((error as DataParserToJsonSchemaRenderError).error, "dataParserNotSupport"),
				).toBe(true);

				return true;
			},
		);
	});

	it("throws when transformation fails", () => {
		throws(
			() => render(
				DPE.string(),
				{
					identifier: "ErrorSchema",
					transformers: [(schema) => E.left("buildDataParserError", schema)],
					version: "jsonSchema7",
				},
			),
			(error) => {
				expect(error).toBeInstanceOf(DataParserToJsonSchemaRenderError);
				expect(
					E.hasInformation((error as DataParserToJsonSchemaRenderError).error, "buildDataParserError"),
				).toBe(true);

				return true;
			},
		);
	});

	it("runs transformer hooks", () => {
		const stopHook = vi.fn(({ output }) => output("stop", DPE.string()));
		const shouldNotRun = vi.fn(({ output, schema }) => output("next", schema));

		const result = render(
			DPE.number(),
			{
				identifier: "HookStopSchema",
				transformers: defaultTransformers,
				hooks: [stopHook, shouldNotRun],
				version: "jsonSchema7",
			},
		);

		expect(stopHook).toHaveBeenCalledTimes(1);
		expect(shouldNotRun).not.toHaveBeenCalled();
		expect(result.definitions.HookStopSchema).toStrictEqual({ type: "string" });
	});

	it("chains transformer hooks", () => {
		const useLessHook = vi.fn(({ output, schema }) => output("next", schema));
		const replaceHook = vi.fn(({ output }) => output("stop", DPE.string()));

		const result = render(
			DPE.number(),
			{
				identifier: "HookNextSchema",
				transformers: defaultTransformers,
				hooks: [useLessHook, replaceHook],
				version: "jsonSchema7",
			},
		);

		expect(useLessHook).toHaveBeenCalledTimes(1);
		expect(replaceHook).toHaveBeenCalledTimes(1);
		expect(result.definitions.HookNextSchema).toStrictEqual({ type: "string" });
	});

	it("reuses identified schema references", () => {
		const schema = DPE.object({
			value: DPE.string(),
		}).addIdentifier("ReferencedSchema");

		expect(
			render(
				DPE.object({
					value: schema,
					other: schema,
				}),
				{
					identifier: "ObjectSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			).definitions.ObjectSchema,
		).toMatchSnapshot();
	});

	it("keeps existing identifier definition", () => {
		const schema = DP.string().addIdentifier("StringSchema");

		expect(
			render(
				schema,
				{
					identifier: "StringSchema",
					transformers: defaultTransformers,
					version: "jsonSchema7",
				},
			).definitions.StringSchema,
		).toStrictEqual({ type: "string" });
	});

	it("coverage: ignores context entries without schema", () => {
		const context = new Map<any, any>([
			[
				DPE.string(),
				{
					name: "NoSchema",
					isOptional: false,
				},
			],
		]);

		expect(
			render(
				DPE.number(),
				{
					identifier: "NumberSchema",
					transformers: defaultTransformers,
					context,
					version: "jsonSchema7",
				},
			).definitions,
		).toStrictEqual({
			NumberSchema: { type: "number" },
		});
	});
});
