import { A, E, type DP, unwrap, S, justExec, pipe, whenNot, isType, equal } from "@duplojs/utils";
import * as TST from "@scripts/toTypescript";
import type { MapContext, TransformerParams, createTransformer, MaybeTransformerEither } from "./create";
import { factory, type Identifier } from "typescript";
import type { TransformerHook } from "./hook";
import { type createCheckerTransformer } from "../checkerTransformer";
import { getDefinitionDataParser } from "./getDefinitionDataParser";
import { success } from "@duplojs/utils/either";

export interface TransformerFunctionParams {
	readonly dataParserTransformers: readonly ReturnType<typeof createTransformer>[];
	readonly checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly typescriptTransformers: readonly ReturnType<typeof TST.createTransformer>[];
	readonly context: MapContext;
	readonly typescriptContext: TST.MapContext;
	readonly importContext: TST.MapImportContext;
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

	const contextValue = params.context.get(currentDataParser);

	if (contextValue) {
		return E.right(
			"buildSuccess",
			contextValue.identifier,
		);
	}

	const shouldCreateConstDeclaration = A.includes(params.recursiveDataParsers, currentDataParser)
		|| !!currentDataParser.definition.identifier;
	const currentIdentifier = shouldCreateConstDeclaration
		? factory.createIdentifier(
			currentDataParser.definition.identifier !== undefined
				? `${S.uncapitalize(currentDataParser.definition.identifier)}DataParser`
				: `recursiveDataParser${params.context.size + params.context.size}`,
		)
		: undefined;

	if (currentIdentifier) {
		params.context.set(
			currentDataParser,
			{
				identifier: currentIdentifier,
				expression: factory.createIdentifier("undefined"),
				typeIdentifier: null,
			},
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
		importContext: params.importContext,
		getDefinition(customProperties = []) {
			return getDefinitionDataParser({
				dataParser: currentDataParser,
				checkerTransformers: params.checkerTransformers,
				customProperties,
			});
		},
		addImport(path, typeName, type) {
			if (equal(type, ["clause", "default"])) {
				params.importContext.set(path, {
					type,
					identifier: typeName,
				});
			}

			const types = pipe(
				params.importContext.get(path),
				whenNot(
					isType("array"),
					() => [],
				),
			);

			if (!A.includes(types, typeName)) {
				params.importContext.set(path, A.push(types, typeName));
			}
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
		return result;
	}

	if (currentIdentifier) {
		const typeIdentifier = justExec(() => {
			if (!A.includes(params.recursiveDataParsers, currentDataParser)) {
				return undefined;
			}
			const identifier = `$${currentIdentifier.text}`;

			const result = TST.buildContext(
				currentDataParser,
				{
					identifier,
					transformers: params.typescriptTransformers,
					context: params.typescriptContext,
					importContext: params.importContext,
					...params.toTypescript,
				},
			);
			return E.matchInformationOtherwise(
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
				},
				() => factory.createIdentifier(identifier),
			);
		});

		if (E.isLeft(typeIdentifier)) {
			return typeIdentifier;
		}

		params.context.set(
			currentDataParser,
			{
				identifier: currentIdentifier,
				expression: unwrap(result),
				typeIdentifier: typeIdentifier ?? null,
			},
		);

		return E.right(
			"buildSuccess",
			currentIdentifier,
		);
	}

	return E.right(
		"buildSuccess",
		unwrap(result),
	);
}
