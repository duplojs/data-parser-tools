import { DP, P } from "@duplojs/utils";
import { factory } from "typescript";
import { createTransformer } from "../create";

const theDate = factory.createTypeReferenceNode(
	factory.createIdentifier("TheDate"),
);

const serializedTheDate = factory.createTypeReferenceNode(
	factory.createIdentifier("SerializedTheDate"),
);

const nativeDate = factory.createTypeReferenceNode(
	factory.createIdentifier("Date"),
	undefined,
);

export const dateTransformer = createTransformer(
	DP.dateKind.has,
	(
		__schema,
		{
			mode,
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/utils/date", "TheDate");

		return P.match(mode)
			.with(
				"out",
				() => success(theDate),
			)
			.with(
				"in",
				() => {
					addImport("@duplojs/utils/date", "SerializedTheDate");

					return success(
						factory.createUnionTypeNode([
							theDate,
							nativeDate,
							serializedTheDate,
						]),
					);
				},
			)
			.exhaustive();
	},
);
