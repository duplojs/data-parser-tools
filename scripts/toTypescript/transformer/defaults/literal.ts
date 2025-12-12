import { A, DP, isType, P, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, SyntaxKind } from "typescript";

export const literalTransformer = createTransformer(
	DP.literalKind.has,
	(
		schema,
		{ success },
	) => pipe(
		schema.definition.value,
		A.map(
			(value) => P.match(value)
				.when(
					isType("string"),
					(value) => factory.createLiteralTypeNode(factory.createStringLiteral(value)),
				)
				.when(
					isType("number"),
					(value) => factory.createLiteralTypeNode(factory.createNumericLiteral(value)),
				)
				.when(
					isType("boolean"),
					(value) => factory.createLiteralTypeNode(value ? factory.createTrue() : factory.createFalse()),
				)
				.when(
					isType("bigint"),
					(value) => factory.createLiteralTypeNode(factory.createBigIntLiteral(`${value}n`)),
				)
				.when(
					isType("undefined"),
					() => factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
				)
				.when(
					isType("null"),
					() => factory.createLiteralTypeNode(factory.createNull()),
				)
				.exhaustive(),
		),
		factory.createUnionTypeNode,
		success,
	),
);

