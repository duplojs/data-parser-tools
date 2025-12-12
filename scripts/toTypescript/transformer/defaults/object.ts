import { A, DP, E, innerPipe, isType, O, P, pipe, S, when, whenElse } from "@duplojs/utils";
import { factory, isUnionTypeNode, SyntaxKind, type TypeNode, type TypeElement } from "typescript";
import { createTransformer } from "../create";

function includesUndefinedTypeNode(typeNode: TypeNode): boolean {
	if (typeNode.kind === SyntaxKind.UndefinedKeyword) {
		return true;
	}

	if (isUnionTypeNode(typeNode)) {
		return typeNode.types.some(
			(subTypeNode) => includesUndefinedTypeNode(subTypeNode),
		);
	}

	return false;
}

const regexIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export const objectTransformer = createTransformer(
	DP.objectKind.has,
	(
		schema,
		{
			transformer,
			success,
		},
	) => pipe(
		schema.definition.shape,
		O.entries,
		A.reduce(
			A.reduceFrom<TypeElement[]>([]),
			({ element: [key, value], lastValue, next, exit }) => pipe(
				transformer(value),
				when(
					E.isLeft,
					exit,
				),
				E.whenIsRight(
					(typeNode) => pipe(
						includesUndefinedTypeNode(typeNode),
						P.match(true, () => factory.createToken(SyntaxKind.QuestionToken)),
						P.match(false, () => undefined),
						P.exhaustive,
						(optional) => pipe(
							key,
							whenElse(
								S.test(regexIdentifier),
								factory.createIdentifier,
								factory.createStringLiteral,
							),
							(propertyName) => factory.createPropertySignature(
								undefined,
								propertyName,
								optional,
								typeNode,
							),
							(typeElement) => A.push(lastValue, typeElement),
							next,
						),
					),
				),
			),
		),
		when(
			isType("array"),
			innerPipe(
				factory.createTypeLiteralNode,
				success,
			),
		),
	),
);
