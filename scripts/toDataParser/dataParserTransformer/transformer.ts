import { A, E, type DP, pipe, unwrap, when } from "@duplojs/utils";
import type { MapContext, TransformerParams, createTransformer, MapImportClause, MaybeTransformerEither } from "./create";
import { factory, type PropertyAssignment, type CallExpression, type Identifier } from "typescript";
import type { TransformerHook } from "./hook";
import { type createCheckerTransformer, checkerTransformer } from "../checkerTransformer";

export function getDefinitionDataParser(
	dataParser: DP.DataParser,
	checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[],
	customProperties?: readonly PropertyAssignment[],
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
	if (customProperties) {
		propertyAssignments.push(...customProperties);
	}
	if (A.minElements(dataParser.definition.checkers, 1)) {
		const checkers = A.reduce(
			dataParser.definition.checkers,
			A.reduceFrom<CallExpression[]>([]),
			({ element, lastValue, nextPush, exit }) => pipe(
				checkerTransformer(element, { transformers: checkerTransformers }),
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
				factory.createArrayLiteralExpression(checkers),
			),
		);
	}

	return A.minElements(propertyAssignments, 1)
		? <const>[factory.createObjectLiteralExpression(propertyAssignments)]
		: <const>[];
}

export interface TransformerFunctionParams {
	readonly dataParserTransformers: readonly ReturnType<typeof createTransformer>[];
	readonly checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly context: MapContext;
	readonly buildingConstNames: Map<DP.DataParser, Identifier>;
	readonly dependencyIdentifier: Identifier;
	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataParsers: DP.DataParser[];
	readonly importClause: MapImportClause;
}

export function transformer(
	dataParser: DP.DataParser,
	params: TransformerFunctionParams,
) {
	const currentDataParser = A.reduce(
		params.hooks,
		A.reduceFrom<DP.DataParser>(dataParser),
		({ element: hook, lastValue, next, exit }) => {
			const result = hook({
				dataParser: lastValue,
				context: params.context,
				importDataParser: params.importClause,
				output: (action, dataParser) => ({
					dataParser,
					action,
				}),
			});
			if (result.action === "stop") {
				return exit(result.dataParser);
			} else {
				return next(result.dataParser);
			}
		},
	);

	const contextValue = params.context.get(currentDataParser);

	if (contextValue) {
		return E.right(
			"buildSuccess",
			contextValue.constName,
		);
	}

	const currentBuildingConstName = params.buildingConstNames.get(currentDataParser);

	if (currentBuildingConstName) {
		return E.right(
			"buildSuccess",
			currentBuildingConstName,
		);
	}

	const shouldCreateConstDeclaration = A.includes(params.recursiveDataParsers, currentDataParser)
		|| !!currentDataParser.definition.constName;
	const currentConstName = shouldCreateConstDeclaration
		? factory.createIdentifier(
			currentDataParser.definition.constName
			?? `recursiveDataParser${params.context.size + params.buildingConstNames.size}`,
		)
		: undefined;

	if (currentConstName) {
		params.buildingConstNames.set(
			currentDataParser,
			currentConstName,
		);
	}

	const functionParams: TransformerParams = {
		success(result) {
			return E.right("buildSuccess", result);
		},
		transformer(dataParser) {
			return transformer(
				dataParser,
				params,
			);
		},
		context: params.context,
		dependencyIdentifier: params.dependencyIdentifier,
		buildError() {
			return E.left("buildDataParserError", currentDataParser);
		},
		importClause: params.importClause,
		getDefinition(customProperties) {
			return getDefinitionDataParser(currentDataParser, params.checkerTransformers, customProperties);
		},
		addImportClause(path, clause) {
			params.importClause.set(path, clause);
		},
	};

	const result = currentDataParser.definition.overrideDataParserTransformer
		? currentDataParser.definition.overrideDataParserTransformer(
			currentDataParser.addOverrideDataParserTransformer(null),
			functionParams,
		)
		: A.reduce(
			params.dataParserTransformers,
			A.reduceFrom<MaybeTransformerEither>(
				E.left("dataParserNotSupport", currentDataParser),
			),
			({
				element: functionBuilder,
				lastValue,
				next,
				exit,
			}) => {
				const result = functionBuilder(currentDataParser, functionParams);

				if (E.isLeft(result)) {
					if (!E.hasInformation(result, "dataParserNotSupport")) {
						return exit(result);
					}

					return next(lastValue);
				}

				return exit(result);
			},
		);

	if (E.isLeft(result)) {
		if (currentConstName) {
			params.buildingConstNames.delete(currentDataParser);
		}

		return result;
	}

	if (currentConstName) {
		params.buildingConstNames.delete(currentDataParser);
		params.context.set(
			currentDataParser,
			{
				constName: currentConstName,
				expression: unwrap(result),
			},
		);

		return E.right(
			"buildSuccess",
			currentConstName,
		);
	}

	return result;
}
