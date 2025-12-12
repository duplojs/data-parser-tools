import { DP, E, unwrap } from "@duplojs/utils";
import { factory, type TypeNode } from "typescript";
import { createTransformer } from "../create";

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
		const recordType: TypeNode = factory.createTypeReferenceNode(
			"Record",
			[keyType, valueType],
		);

		return success(recordType);
	},
);
