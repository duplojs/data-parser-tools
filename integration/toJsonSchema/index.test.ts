import { render, defaultTransformers, type JsonSchema } from "@duplojs/data-parser-tools/toJsonSchema";
import { DPE, type ExpectType } from "@duplojs/utils";

it("integration", () => {
	const userSchema = DPE.object({
		id: DPE.templateLiteral(["user-", DPE.number(), "-db1"]),
		name: DPE.string().min(2),
		email: DPE.email(),
		role: DPE.literal(["admin", "editor", "viewer"]),
		age: DPE.coerce.number().min(0).optional(),
		contact: DPE.union([
			DPE.object({
				phone: DPE.string().regex(/^[+\\d][\\d\\s-]{5,}$/),
			}),
			DPE.object({
				email: DPE.email(),
			}),
		]),
		address: DPE.object({
			street: DPE.string(),
			city: DPE.string(),
			zip: DPE.string().regex(/^\\d{5}$/),
			country: DPE.literal("FR"),
		}),
		roles: DPE.literal(["admin", "editor", "viewer"]).array().min(1),
		preferences: DPE.object({
			theme: DPE.literal(["light", "dark"]),
			newsletter: DPE.boolean(),
		}).nullable(),
		metadata: DPE.record(DPE.string(), DPE.string(), { requireKey: null }),
		location: DPE.tuple([DPE.number(), DPE.number()], { rest: DPE.number() }),
		createdAt: DPE.date({ coerce: true }),
		startAt: DPE.time(),
	}).addIdentifier("UserProfile");

	const result = render(
		userSchema,
		{
			identifier: "UserProfile",
			mode: "in",
			transformers: defaultTransformers,
			version: "jsonSchema7",
		},
	);

	type check = ExpectType<
		typeof result,
		{
			$ref: `#/$defs/${string}`;
			$schema: "http://json-schema.org/draft-07/schema#";
			definitions: Record<string, JsonSchema>;
		},
		"strict"
	>;

	expect(result).toMatchSnapshot();
});
