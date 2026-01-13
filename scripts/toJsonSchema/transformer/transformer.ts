import { A, E, justReturn, unwrap, whenElse, type DP } from "@duplojs/utils";
import {
	type MapContext,
	type DataParserNotSupportedEither,
	type TransformerParams,
	type createTransformer,
	type TransformerMode,
	type SupportedVersionsUrl,
	type JsonSchema,
	type DataParserErrorEither,
} from "./create";
import { type TransformerHook } from "./hook";

export interface TransformerFunctionParams {
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context: MapContext;
	readonly mode: TransformerMode;
	readonly version: SupportedVersionsUrl;
	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataParsers: DP.DataParser[];
}

export function buildRef(
	name: string,
	version: SupportedVersionsUrl,
) {
	if (
		version === "https://spec.openapis.org/oas/3.0.3"
		|| version === "https://spec.openapis.org/oas/3.1.0"
	) {
		return `#/components/schemas/${name}`;
	}

	if (version === "https://json-schema.org/draft/2020-12/schema") {
		return `#/$defs/${name}`;
	}

	return `#/definitions/${name}`;
}

export function transformer(
	schema: DP.DataParser,
	params: TransformerFunctionParams,
) {
	const currentSchema = A.reduce(
		params.hooks,
		A.reduceFrom<DP.DataParser>(schema),
		({ element: hook, lastValue, next, exit }) => {
			const result = hook({
				schema: lastValue,
				context: params.context,
				output: (action, schema) => ({
					schema,
					action,
				}),
			});
			if (result.action === "stop") {
				return exit(result.schema);
			} else {
				return next(result.schema);
			}
		},
	);

	const currentDeclaration = params.context.get(currentSchema);

	if (currentDeclaration) {
		return E.right(
			"buildSuccess",
			{
				schema: { $ref: buildRef(currentDeclaration.name, params.version) },
				canBeUndefined: currentDeclaration.canBeUndefined,
			},
		);
	}

	const currentIdentifier = whenElse(
		params.recursiveDataParsers,
		A.includes(currentSchema),
		() => {
			const identifier = currentSchema.definition.identifier ?? `RecursiveType${params.context.size}`;

			params.context.set(
				currentSchema,
				{
					name: identifier,
					canBeUndefined: false,
				},
			);

			return identifier;
		},
		justReturn(currentSchema.definition.identifier),
	);

	const functionParams: TransformerParams = {
		success(result, canBeUndefined = false) {
			return E.right("buildSuccess", {
				schema: result,
				canBeUndefined,
			});
		},
		transformer(schema) {
			return transformer(
				schema,
				params,
			);
		},
		context: params.context,
		mode: params.mode,
		version: params.version,
		buildError() {
			return E.left("buildDataParserError", currentSchema);
		},
	};

	const result = A.reduce(
		params.transformers,
		A.reduceFrom<DataParserNotSupportedEither | DataParserErrorEither>(
			E.left("dataParserNotSupport", currentSchema),
		),
		({
			element: functionBuilder,
			lastValue,
			next,
			exit,
		}) => {
			const result = functionBuilder(currentSchema, functionParams);

			if (E.isLeft(result)) {
				if (unwrap(result) !== currentSchema) {
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
		const { schema: builtSchema, canBeUndefined } = unwrap(result);

		params.context.set(
			currentSchema,
			{
				name: currentIdentifier,
				schema: builtSchema,
				canBeUndefined,
			},
		);

		return functionParams.success(
			{ $ref: buildRef(currentIdentifier, params.version) },
			canBeUndefined,
		);
	}

	return result;
}
