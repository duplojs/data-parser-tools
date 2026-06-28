import { A, DP, E, innerPipe, isType, or, P, pipe, when } from "@duplojs/utils";
import { factory, type TemplateLiteralTypeSpan, type TypeNode } from "typescript";
import { createTransformer } from "../create";

export const templateLiteralTransformer = createTransformer(
	DP.templateLiteralKind.has,
	(
		schema,
		{
			transformer,
			success,
			buildError,
		},
	) => {
		const members = A.reduce(
			schema.definition.template,
			A.reduceFrom<(string | TypeNode)[]>([]),
			({ element, lastValue, next, exit, nextPush }) => P.match(element)
				.when(
					or([
						isType("string"),
						isType("boolean"),
						isType("bigint"),
						isType("null"),
						isType("undefined"),
						isType("number"),
					]),
					innerPipe(
						when(
							isType("bigint"),
							(value) => `${value}n`,
						),
						String,
						(value) => {
							const last = A.last(lastValue);

							if (isType(last, "string")) {
								return next(A.set(lastValue, -1, `${last}${value}`));
							} else {
								return nextPush(lastValue, value);
							}
						},
					),
				)
				.when(
					DP.dataParserKind.has,
					innerPipe(
						transformer,
						when(
							E.isLeft,
							exit,
						),
						E.whenIsRight(
							(typeNode) => {
								if (isType(A.last(lastValue), "object")) {
									return nextPush(lastValue, "", typeNode);
								} else {
									return nextPush(lastValue, typeNode);
								}
							},
						),
					),
				)
				.exhaustive(),
		);

		if (E.isLeft(members)) {
			return members;
		}

		const head = A.first(members);

		if (head === undefined) {
			return pipe(
				"",
				factory.createNoSubstitutionTemplateLiteral,
				factory.createLiteralTypeNode,
				success,
			);
		}

		const templateHead = isType(head, "string")
			? factory.createTemplateHead(head)
			: factory.createTemplateHead("");

		const membersWithoutHead = isType(head, "string")
			? A.shift(members)
			: members;

		const templateSpans = pipe(
			membersWithoutHead,
			A.chunk(2),
			A.reduce(
				A.reduceFrom<TemplateLiteralTypeSpan[]>([]),
				({ element, lastValue, exit, self, nextPush, index }) => {
					const [typeNode, separator = ""] = element;

					if (!isType(typeNode, "object") || isType(separator, "object")) {
						return exit(buildError());
					}

					return nextPush(
						lastValue,
						factory.createTemplateLiteralTypeSpan(
							typeNode,
							A.isLastIndex(self, index)
								? factory.createTemplateTail(separator)
								: factory.createTemplateMiddle(separator),
						),
					);
				},
			),
		);

		if (E.isLeft(templateSpans)) {
			return templateSpans;
		}

		return success(
			factory.createTemplateLiteralType(
				templateHead,
				templateSpans,
			),
		);
	},
);
