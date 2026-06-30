import { A, E, type DP, unwrap, justExec } from "@duplojs/utils";
import * as TST from "@scripts/toTypescript";
import type { MapContext, TransformerParams, createTransformer, MaybeTransformerEither, DependenciesContext, MapContextValue } from "./create";
import { factory, type Identifier } from "typescript";
import type { TransformerHook } from "./hook";
import type { createCheckerTransformer } from "../checkerTransformer";
import { getDefinitionDataParser } from "./getDefinitionDataParser";
import { createIdentifier } from "./createIdentifier";

export interface TransformerFunctionParams {
	readonly dataParserTransformers: readonly ReturnType<typeof createTransformer>[];
	readonly checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly typescriptTransformers: readonly ReturnType<typeof TST.createTransformer>[];
	readonly typescriptCheckerRefiner?: readonly ReturnType<typeof TST.createCheckerRefiner>[];
	readonly context: MapContext;
	readonly typescriptContext: TST.MapContext;
	readonly importContext: TST.MapImportContext;
	readonly dependenciesContext: DependenciesContext;
	readonly dependencyIdentifier: Identifier;
	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataParsers: DP.DataParser[];
	readonly toTypescript?: {
		readonly mode?: TST.TransformerMode;
		readonly hooks?: readonly TST.TransformerHook[];
	};
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
				importContext: params.importContext,
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

	if (currentDataParser.definition.identifier) {
		params.dependenciesContext.add(currentDataParser);
	}

	const identifiedDataParser = params.context.get(currentDataParser);

	if (identifiedDataParser) {
		return E.right(
			"buildSuccess",
			identifiedDataParser.identifier,
		);
	}

	const newIdentifiedDataParser = justExec(() => {
		const currentIdentifier = A.includes(params.recursiveDataParsers, currentDataParser)
		|| !!currentDataParser.definition.identifier
			? factory.createIdentifier(
				currentDataParser.definition.identifier !== undefined
					? createIdentifier(currentDataParser.definition.identifier)
					: `recursive${params.context.size}DataParser`,
			)
			: undefined;

		if (!currentIdentifier) {
			return null;
		}

		const contextValue: MapContextValue = {
			identifier: currentIdentifier,
			expression: factory.createIdentifier("undefined"),
			typeIdentifier: null,
			dependencies: new Set(),
		};

		params.context.set(
			currentDataParser,
			contextValue,
		);

		return contextValue;
	});

	const functionParams: TransformerParams = {
		success(result) {
			return E.right("buildSuccess", result);
		},
		transformer(dataParser) {
			return transformer(
				dataParser,
				{
					...params,
					dependenciesContext: newIdentifiedDataParser?.dependencies
						?? params.dependenciesContext,
				},
			);
		},
		context: params.context,
		dependencyIdentifier: params.dependencyIdentifier,
		buildError() {
			return E.left("buildDataParserError", currentDataParser);
		},
		importContext: params.importContext,
		getDefinition(customProperties = []) {
			return getDefinitionDataParser({
				dataParser: currentDataParser,
				checkerTransformers: params.checkerTransformers,
				importContext: params.importContext,
				customProperties,
			});
		},
		addImport: TST.createAddImport(params.importContext),
	};

	if (currentDataParser.definition.mapImportContextEntries) {
		TST.applyMapImportContextEntries(
			functionParams.addImport,
			currentDataParser.definition.mapImportContextEntries,
		);
	}

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
					if (
						E.hasInformation(result, [
							"buildDataParserError",
							"buildDataParserGetDefinitionError",
							"toTypescriptBuildDataParserError",
							"toTypescriptBuildCheckerError",
						])
					) {
						return exit(result);
					}

					return next(lastValue);
				}

				return exit(result);
			},
		);

	if (E.isLeft(result)) {
		return result;
	}

	if (newIdentifiedDataParser) {
		const typeIdentifier = justExec(() => {
			if (!A.includes(params.recursiveDataParsers, currentDataParser)) {
				return null;
			}
			const identifier = `$${newIdentifiedDataParser.identifier.text}`;

			const result = TST.buildContext(
				currentDataParser,
				{
					identifier,
					transformers: params.typescriptTransformers,
					checkerRefiner: params.typescriptCheckerRefiner,
					context: params.typescriptContext,
					importContext: params.importContext,
					...params.toTypescript,
				},
			);
			return E.matchInformation(
				result,
				{
					buildDataParserError: (dataParser) => E.left(
						"toTypescriptBuildDataParserError",
						dataParser,
					),
					dataParserNotSupport: (dataParser) => E.left(
						"toTypescriptDataParserNotSupport",
						dataParser,
					),
					buildCheckerError: (checker) => E.left(
						"toTypescriptBuildCheckerError",
						checker,
					),
					success: () => factory.createIdentifier(identifier),
				},
			);
		});

		if (E.isLeft(typeIdentifier)) {
			return typeIdentifier;
		}

		params.context.delete(currentDataParser);

		params.context.set(
			currentDataParser,
			{
				...newIdentifiedDataParser,
				expression: unwrap(result),
				typeIdentifier: typeIdentifier,
			},
		);

		return E.right(
			"buildSuccess",
			newIdentifiedDataParser.identifier,
		);
	}

	return E.right(
		"buildSuccess",
		unwrap(result),
	);
}
