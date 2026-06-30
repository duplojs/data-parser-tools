import { A, type DP, E, pipe, when } from "@duplojs/utils";
import { checkerTransformer, type createCheckerTransformer } from "../checkerTransformer";
import { type CallExpression, factory, type Identifier, type PropertyAssignment } from "typescript";
import type * as TST from "@scripts/toTypescript";

export interface getDefinitionDataParserParams {
	readonly checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly importContext: TST.MapImportContext;
	readonly customProperties: readonly PropertyAssignment[];
	readonly keepIdentifier: boolean;
}

export function getDefinitionDataParser(
	dataParser: DP.DataParser,
	params: getDefinitionDataParserParams,
) {
	const propertyAssignments: PropertyAssignment[] = [];

	if (dataParser.definition.errorMessage) {
		propertyAssignments.push(
			factory.createPropertyAssignment(
				factory.createIdentifier("errorMessage"),
				factory.createStringLiteral(dataParser.definition.errorMessage),
			),
		);
	}

	if (params.keepIdentifier && dataParser.definition.identifier) {
		propertyAssignments.push(
			factory.createPropertyAssignment(
				factory.createIdentifier("identifier"),
				factory.createStringLiteral(dataParser.definition.identifier),
			),
		);
	}

	if (A.minElements(params.customProperties, 1)) {
		propertyAssignments.push(...params.customProperties);
	}

	if (A.minElements(dataParser.definition.checkers, 1)) {
		const checkers = A.reduce(
			dataParser.definition.checkers,
			A.reduceFrom<(CallExpression | Identifier)[]>([]),
			({ element, lastValue, nextPush, exit }) => pipe(
				checkerTransformer(
					element,
					{
						transformers: params.checkerTransformers,
						importContext: params.importContext,
					},
				),
				E.whenIsRight(
					(value) => nextPush(lastValue, value),
				),
				when(
					E.isLeft,
					exit,
				),
			),
		);

		if (E.isLeft(checkers)) {
			return E.left("buildDataParserGetDefinitionError", {
				dataParser,
				error: checkers,
			});
		}

		propertyAssignments.push(
			factory.createPropertyAssignment(
				factory.createIdentifier("checkers"),
				factory.createArrayLiteralExpression(
					checkers,
					A.minElements(checkers, 2),
				),
			),
		);
	}

	return A.minElements(propertyAssignments, 1)
		? <const>[
			factory.createObjectLiteralExpression(
				propertyAssignments,
				A.minElements(propertyAssignments, 2),
			),
		]
		: <const>[];
}
