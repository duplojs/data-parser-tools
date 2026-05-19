import { DP, E, pipe, unwrap } from "@duplojs/utils";
import { createTransformer } from "../create";
import { createSourceFile, factory, isArrowFunction, isExpressionStatement, isFunctionExpression, isParenthesizedExpression, ScriptTarget } from "typescript";

export const transformTransformer = createTransformer(
	DP.transformKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			transformer,
			buildError,
		},
	) => {
		const inner = transformer(dataParser.definition.inner);

		if (E.isLeft(inner)) {
			return inner;
		}

		const theFunction = dataParser.definition.theFunction.toString();

		if (theFunction.includes("[native code]")) {
			return buildError();
		}

		const sourceFile = createSourceFile(
			"refine-function.ts",
			`(${theFunction})`,
			ScriptTarget.Latest,
			false,
		);

		const statement = sourceFile.statements[0];
		if (!statement || !isExpressionStatement(statement)) {
			return buildError();
		}

		const functionExpression = isParenthesizedExpression(statement.expression)
			? statement.expression.expression
			: undefined;

		if (
			!functionExpression
			|| (
				!isFunctionExpression(functionExpression)
				&& !isArrowFunction(functionExpression)
			)
		) {
			return buildError();
		}

		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					dependencyIdentifier,
					factory.createIdentifier("transform"),
				),
				undefined,
				[
					unwrap(inner),
					functionExpression,
					...definition,
				],
			),
			success,
		);
	},
);
