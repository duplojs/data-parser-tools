import { DP, E, pipe, unwrap, when } from "@duplojs/utils";
import { factory, type TypeNode } from "typescript";
import { createTransformer } from "../create";
import { includesUndefinedTypeNode } from "../includesUndefinedTypeNode";

export const recordTransformer = createTransformer(
	DP.recordKind.has,
	(
		{ definition: { key, value } },
		{
			transformer,
			success,
		},
	) => {
		const keyResult = transformer(key);

		if (E.isLeft(keyResult)) {
			return keyResult;
		}

		const valueResult = transformer(value);

		if (E.isLeft(valueResult)) {
			return valueResult;
		}

		const keyType = unwrap(keyResult);
		const valueType = unwrap(valueResult);
		const recordType = pipe(
			factory.createTypeReferenceNode(
				"Record",
				[keyType, valueType],
			),
			when(
				() => includesUndefinedTypeNode(valueType),
				(recodeTypeNode) => factory.createTypeReferenceNode(
					"Partial",
					[recodeTypeNode],
				),
			),
		);

		return success(recordType);
	},
);
