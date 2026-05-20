import { asserts, DPE, E, Path, S, unwrap } from "@duplojs/utils";
import { SF } from "@duplojs/server-utils";
import { defaultCheckerTransformers, defaultTransformers, render } from "@duplojs/data-parser-tools/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@duplojs/data-parser-tools/toTypescript";

async function typedSnapshot(value: string, filePath: string) {
	const absoluteFilePath = Path.resolveRelative([import.meta.dirname, filePath]);

	const exist = await SF.exists(absoluteFilePath);

	if (E.isLeft(exist)) {
		const writeTextFileResult = await SF.writeTextFile(absoluteFilePath, value);
		asserts(writeTextFileResult, E.isRight);
	}

	const expected = await E.rightAsyncPipe(
		absoluteFilePath,
		SF.readTextFile,
		S.trim,
	);

	asserts(expected, E.isRight);

	expect(value).toBe(unwrap(expected));
}

describe("integration", () => {
	it("basic", async() => {
		const userSchema = DPE.object({
			id: DPE.templateLiteral(["user-", DPE.number(), "-db1"]),
			name: DPE.string().min(2),
			email: DPE.email(),
			role: DPE.literal(["admin", "editor", "viewer"]),
			age: DPE
				.coerce
				.number()
				.min(0)
				.max(80)
				.optional(),
			contact: DPE.union([
				DPE.object({
					phone: DPE.string().regex(/^[+\d][\d\s-]{5,}$/),
				}),
				DPE.object({
					email: DPE.email(),
				}),
			]),
			address: DPE.object({
				street: DPE.string(),
				city: DPE.string(),
				zip: DPE.string().regex(/^\d{5}$/),
				country: DPE.literal("FR"),
			}),
			roles: DPE.literal(["admin", "editor", "viewer"]).array().min(1),
			preferences: DPE.object({
				theme: DPE.literal(["light", "dark"]),
				newsletter: DPE.boolean(),
			}).nullable(),
			metadata: DPE.record(DPE.string(), DPE.string()),
			location: DPE.tuple([DPE.number(), DPE.number()], { rest: DPE.number() }),
			createdAt: DPE.date({ coerce: true }),
			startAt: DPE.time(),
		}).addConstName("userProfileParser");

		const result = render(
			userSchema,
			{
				constName: "userProfileParser",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				toTypescript: {
					identifier: "UserProfile",
					transformers: tsDefaultTransformers,
				},
			},
		);

		await typedSnapshot(result, "__snapshots__/basic.gen.ts");
	});

	it("recursive", async() => {
		const commentSchema: DPE.DataParser<unknown> = DPE.object({
			id: DPE.string(),
			replies: DPE.lazy(() => commentSchema).array(),
		});

		const metaSchema: DPE.DataParser<unknown> = DPE.tuple([
			DPE.string(),
			DPE.lazy(() => metaSchema).array(),
		]);

		const nodeSchema: DPE.DataParser<unknown> = DPE.object({
			name: DPE.string(),
			children: DPE.lazy(() => nodeSchema).array(),
			comment: commentSchema,
			meta: metaSchema,
		}).addConstName("recursiveNodeDataParser");

		const result = render(
			nodeSchema,
			{
				constName: "recursiveNodeDataParser",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				toTypescript: {
					identifier: "RecursiveNode",
					transformers: tsDefaultTransformers,
				},
			},
		);

		await typedSnapshot(result, "__snapshots__/recursive.gen.ts");
	});

	it("divide with constName", async() => {
		const roleDataParser = DPE.literal(["admin", "editor", "viewer"]).addConstName("userRoleDataParser");

		const userDataParser = DPE.object({
			id: DPE.templateLiteral(["user-", DPE.number(), "-db1"]),
			name: DPE.string().min(2),
			email: DPE.email(),
			role: roleDataParser,
		}).addConstName("userDataParser");

		const result = render(
			userDataParser,
			{
				constName: "userDataParser",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				toTypescript: {
					identifier: "UserProfile",
					transformers: tsDefaultTransformers,
				},
			},
		);

		await typedSnapshot(result, "__snapshots__/withConstName.gen.ts");
	});
});
