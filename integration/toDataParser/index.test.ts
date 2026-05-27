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
		const userDataParser = DPE.object({
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
		});

		const result = render(
			userDataParser,
			{
				identifier: "user",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
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
			comment: DPE.lazy(() => commentSchema),
			meta: DPE.lazy(() => metaSchema),
		});

		const result = render(
			nodeSchema,
			{
				identifier: "recursiveNode",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
			},
		);

		await typedSnapshot(result, "__snapshots__/recursive.gen.ts");
	});

	it("divide with identifier", async() => {
		const userRoleDataParser = DPE.literal(["admin", "editor", "viewer"]).addIdentifier("userRole");

		const userDataParser = DPE.object({
			id: DPE.templateLiteral(["user-", DPE.number(), "-db1"]),
			name: DPE.string().min(2),
			email: DPE.email(),
			role: userRoleDataParser,
		});

		const result = render(
			userDataParser,
			{
				identifier: "user",
				dataParserTransformers: defaultTransformers,
				checkerTransformers: defaultCheckerTransformers,
				typescriptTransformers: tsDefaultTransformers,
			},
		);

		await typedSnapshot(result, "__snapshots__/withIdentifier.gen.ts");
	});
});
