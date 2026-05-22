import { A, E, justExec, pipe } from "@duplojs/utils";
import { createTransformer } from "../create";
import { factory, type PropertyAssignment } from "typescript";
import { SDP } from "@duplojs/server-utils";

export const fileTransformer = createTransformer(
	SDP.fileKind.has,
	(
		dataParser,
		{
			success,
			dependencyIdentifier,
			getDefinition,
			addImport,
		},
	) => {
		const definition = getDefinition();

		if (E.isLeft(definition)) {
			return definition;
		}

		const dataParserFileParams: PropertyAssignment[] = [];

		if (dataParser.definition.coerce) {
			dataParserFileParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("coerce"),
					factory.createTrue(),
				),
			);
		}
		if (dataParser.definition.checkExist) {
			dataParserFileParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("checkExist"),
					factory.createTrue(),
				),
			);
		}
		if (dataParser.definition.maxSize) {
			dataParserFileParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("maxSize"),
					factory.createNumericLiteral(dataParser.definition.maxSize),
				),
			);
		}
		if (dataParser.definition.minSize) {
			dataParserFileParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("minSize"),
					factory.createNumericLiteral(dataParser.definition.minSize),
				),
			);
		}
		if (dataParser.definition.mimeType) {
			dataParserFileParams.push(
				factory.createPropertyAssignment(
					factory.createIdentifier("mimeType"),
					factory.createRegularExpressionLiteral(dataParser.definition.mimeType.toString()),
				),
			);
		}

		const namespace = dependencyIdentifier.text === "DP"
			? justExec(
				() => {
					addImport("@duplojs/server-utils/dataParser", "SDP", "clause");
					return "SDP";
				},
			)
			: justExec(
				() => {
					addImport("@duplojs/server-utils/dataParserExtended", "SDPE", "clause");
					return "SDPE";
				},
			);

		return pipe(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					factory.createIdentifier(namespace),
					factory.createIdentifier("file"),
				),
				undefined,
				[
					factory.createObjectLiteralExpression(
						dataParserFileParams,
						A.minElements(dataParserFileParams, 2),
					),
					...definition,
				],
			),
			success,
		);
	},
);
