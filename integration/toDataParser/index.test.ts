import { DPE } from "@duplojs/utils";
import { defaultCheckerTransformers, defaultTransformers, render } from "@duplojs/data-parser-tools/toDataParser";
import { defaultTransformers as tsDefaultTransformers } from "@duplojs/data-parser-tools/toTypescript";

it("integration", () => {
	const userSchema = DPE.object({
		id: DPE.templateLiteral(["user-", DPE.number(), "-db1"]),
		name: DPE.string().min(2),
		email: DPE.email(),
		role: DPE.literal(["admin", "editor", "viewer"]),
		age: DPE.coerce.number().min(0).optional(),
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

	expect(result).toMatchSnapshot();
});
