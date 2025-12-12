import { render, defaultTransformers } from "@duplojs/data-parser-tools/toTypescript";
import { DP } from "@duplojs/utils";

const userSchema = DP.object({
	name: DP.string(),
	age: DP.optional(DP.number()),
}).addIdentifier("User");

const result = render(
	userSchema,
	{
		identifier: "User",
		mode: "out",
		transformers: defaultTransformers,
	},
);

console.log(result);
