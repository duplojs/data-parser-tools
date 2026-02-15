import { DP, unwrap, E, pipe, G, A, S, kindHeritage } from "@duplojs/utils";
import { type DataParserErrorEither, type DataParserNotSupportedEither, transformer, type MapContext, type TransformerMode, type TransformerHook, type createTransformer, type SupportedDataParsers, type MapImportType } from "./transformer";
import { createPrinter, createSourceFile, EmitHint, factory, ScriptKind, ScriptTarget, SyntaxKind } from "typescript";
import { createToTypescriptKind } from "./kind";
import { getRecursiveDataParser } from "@scripts/utils/getRecursiveDataParser";
import { importTypesTransformer } from "./transformer/importTypesTransformer";

export interface RenderParams {
	readonly identifier: string;
	readonly transformers: readonly ReturnType<typeof createTransformer>[];
	readonly context?: MapContext;
	readonly mode?: TransformerMode;
	readonly hooks?: readonly TransformerHook[];
	readonly importType?: MapImportType;
}

export class DataParserToTypescriptRenderError extends kindHeritage(
	"data-parser-to-typescript-render-error",
	createToTypescriptKind("data-parser-to-typescript-render-error"),
	Error,
) {
	public constructor(
		public schema: SupportedDataParsers,
		public error: DataParserNotSupportedEither | DataParserErrorEither,
	) {
		super({}, ["Error during the render of dataParser in typescript type."]);
	}
}

export function render(schema: SupportedDataParsers, params: RenderParams) {
	const context: MapContext = new Map(params.context);
	const importType: MapImportType = new Map(params.importType);

	const result = transformer(
		schema,
		{
			...params,
			context,
			mode: params.mode ?? "out",
			hooks: params.hooks ?? [],
			recursiveDataParsers: getRecursiveDataParser(schema),
			importType,
		},
	);

	if (E.isLeft(result)) {
		throw new DataParserToTypescriptRenderError(
			schema,
			result,
		);
	}

	if (schema.definition.identifier && schema.definition.identifier !== params.identifier) {
		context.set(
			DP.empty(),
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(params.identifier),
				undefined,
				factory.createTypeReferenceNode(
					schema.definition.identifier,
				),
			),
		);
	} else if (schema.definition.identifier !== params.identifier) {
		context.set(
			DP.empty(),
			factory.createTypeAliasDeclaration(
				[factory.createToken(SyntaxKind.ExportKeyword)],
				factory.createIdentifier(params.identifier),
				undefined,
				unwrap(result),
			),
		);
	}

	const sourceFile = createSourceFile("print.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
	const printer = createPrinter();

	return pipe(
		[
			...importTypesTransformer(importType),
			...context.values(),
		],
		G.map(
			(value) => printer.printNode(
				EmitHint.Unspecified,
				value,
				sourceFile,
			),
		),
		A.from,
		A.join("\n\n"),
		S.trim,
	);
}
