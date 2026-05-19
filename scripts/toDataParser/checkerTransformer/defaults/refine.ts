import { DP } from "@duplojs/utils";
import { createCheckerTransformer } from "../create";
import { createSourceFile, factory, isArrowFunction, isExpressionStatement, isFunctionExpression, isParenthesizedExpression, ScriptTarget } from "typescript";

export const checkerRefineTransformer = createCheckerTransformer(
	DP.dataParserCheckerRefineKind.has,
	(
		checker,
		{
			success,
			buildError,
			getDefinition,
		},
	) => {
		const functionSource = checker.definition.theFunction.toString();

		if (functionSource.includes("[native code]")) {
			return buildError();
		}

		const sourceFile = createSourceFile(
			"refine-function.ts",
			`(${functionSource})`,
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

		const expression = factory.createCallExpression(
			factory.createPropertyAccessExpression(
				factory.createIdentifier("DP"),
				factory.createIdentifier("checkerRefine"),
			),
			undefined,
			[
				functionExpression,
				...getDefinition(),
			],
		);

		return success(expression);
	},
);
