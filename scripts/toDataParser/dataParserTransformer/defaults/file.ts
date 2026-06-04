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

		const namespace = dependencyIdentifier.text === "DP"
			? justExec(
				() => {
					addImport("@duplojs/server-utils/dataParser", "SDP", "namespace");
					return "SDP";
				},
			)
			: justExec(
				() => {
					addImport("@duplojs/server-utils/dataParserExtended", "SDPE", "namespace");
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
