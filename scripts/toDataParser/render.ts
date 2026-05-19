import { A, DP, E, kindHeritage, pipe, S, unwrap } from "@duplojs/utils";
import { createPrinter, createSourceFile, EmitHint, factory, NodeFlags, ScriptKind, ScriptTarget, SyntaxKind, type TypeAliasDeclaration, type VariableStatement } from "typescript";
import * as TST from "@scripts/toTypescript";
import { type createCheckerTransformer } from "./checkerTransformer";
import { type TransformerHook, type createTransformer, type MapContext, type MapImportClause, transformer, type DataParserNotSupportedEither, type DataParserGetDefinitionErrorEither, type DataParserErrorEither } from "./dataParserTransformer";
import { getRecursiveDataParser } from "@scripts/utils";
import { createToDataParserKind } from "./kind";
import { importClauseTransformer } from "./dataParserTransformer/importClause";

export class DataParserToDataParserRenderError extends kindHeritage(
	"data-parser-to-data-parser-render-error",
	createToDataParserKind("data-parser-to-data-parser-render-error"),
	Error,
) {
	public constructor(
		public dataParser: DP.DataParser,
		public error: DataParserNotSupportedEither | DataParserErrorEither | DataParserGetDefinitionErrorEither,
	) {
		super({}, ["Error during the render of dataParser in dataParser."]);
	}
}

export class DataParserToDataParserTypeRenderError extends kindHeritage(
	"data-parser-to-data-parser-type-render-error",
	createToDataParserKind("data-parser-to-data-parser-type-render-error"),
	Error,
) {
	public constructor(
		public dataParser: DP.DataParser,
		public error: TST.DataParserNotSupportedEither | TST.DataParserErrorEither,
	) {
		super({}, ["Error during the render of recursive dataParser type."]);
	}
}

export interface RenderParams {
	readonly constName: string;
	readonly dataParserTransformers: readonly ReturnType<typeof createTransformer>[];
	readonly checkerTransformers: readonly ReturnType<typeof createCheckerTransformer>[];
	readonly exportMode?: "normal" | "extended";
	readonly context?: MapContext;
	readonly hooks?: readonly TransformerHook[];
	readonly importClause?: MapImportClause;

	readonly toTypescript: {
		readonly identifier: string;
		readonly transformers: readonly ReturnType<typeof TST.createTransformer>[];
		readonly context?: TST.MapContext;
		readonly mode?: TST.TransformerMode;
		readonly hooks?: readonly TST.TransformerHook[];
		readonly importType?: TST.MapImportType;
	};
}

export function render(dataParser: DP.DataParser, params: RenderParams) {
	const context: MapContext = new Map(params.context);
	const importClause: MapImportClause = new Map(params.importClause);
	const dependencyIdentifier = factory.createIdentifier(params.exportMode === "extended" ? "DPE" : "DP");
	const recursiveDataParsers = getRecursiveDataParser(dataParser);
	const tsContext: TST.MapContext = new Map(params.toTypescript.context);
	const importType: TST.MapImportType = new Map(params.toTypescript.importType);
	const recursiveTypeAliasDeclarations: TypeAliasDeclaration[] = [];
	const recursiveTypeNameByDataParser = new Map<DP.DataParsers, string>();

	importClause.set("@duplojs/utils/dataParser", "DP");

	if (params.exportMode === "extended") {
		importClause.set("@duplojs/utils/dataParserExtended", "DPE");
	}

	if (A.minElements(recursiveDataParsers, 1)) {
		const tsResult = TST.transformer(
			dataParser,
			{
				context: tsContext,
				importType,
				hooks: params.toTypescript.hooks ?? [],
				mode: params.toTypescript.mode ?? "out",
				recursiveDataParsers,
				transformers: params.toTypescript.transformers,
			},
		);

		if (E.isLeft(tsResult)) {
			throw new DataParserToDataParserTypeRenderError(
				dataParser,
				tsResult,
			);
		}

		const typeDeclarations = A.reduce(
			recursiveDataParsers,
			A.reduceFrom<TypeAliasDeclaration[]>([]),
			({ element: recursiveDataParser, lastValue, nextPush, next }) => {
				const declaration = tsContext.get(recursiveDataParser);

				if (!declaration) {
					return next(lastValue);
				}

				recursiveTypeNameByDataParser.set(recursiveDataParser, declaration.name.text);

				return nextPush(lastValue, declaration);
			},
		);

		recursiveTypeAliasDeclarations.push(...typeDeclarations);

		if (A.includes(recursiveDataParsers, dataParser)) {
			if (
				dataParser.definition.identifier
				&& dataParser.definition.identifier !== params.toTypescript.identifier
			) {
				recursiveTypeAliasDeclarations.push(
					factory.createTypeAliasDeclaration(
						[factory.createToken(SyntaxKind.ExportKeyword)],
						factory.createIdentifier(params.toTypescript.identifier),
						undefined,
						factory.createTypeReferenceNode(
							dataParser.definition.identifier,
						),
					),
				);

				recursiveTypeNameByDataParser.set(dataParser, params.toTypescript.identifier);
			} else if (dataParser.definition.identifier !== params.toTypescript.identifier) {
				recursiveTypeAliasDeclarations.push(
					factory.createTypeAliasDeclaration(
						[factory.createToken(SyntaxKind.ExportKeyword)],
						factory.createIdentifier(params.toTypescript.identifier),
						undefined,
						unwrap(tsResult),
					),
				);

				recursiveTypeNameByDataParser.set(dataParser, params.toTypescript.identifier);
			}
		}
	}

	const result = transformer(
		dataParser,
		{
			dataParserTransformers: params.dataParserTransformers,
			checkerTransformers: params.checkerTransformers,
			context,
			buildingConstNames: new Map(),
			recursiveDataParsers,
			importClause,
			dependencyIdentifier,
			hooks: params.hooks ?? [],
		},
	);

	if (E.isLeft(result)) {
		throw new DataParserToDataParserRenderError(
			dataParser,
			result,
		);
	}

	if (dataParser.definition.constName !== params.constName) {
		context.set(
			DP.empty(),
			{
				constName: factory.createIdentifier(params.constName),
				expression: unwrap(result),
			},
		);
	}

	const dataParserConstStatements = A.reduce(
		A.from(context),
		A.reduceFrom<VariableStatement[]>([]),
		({ element: [currentDataParser, contextValue], lastValue, nextPush }) => {
			const recursiveTypeName = recursiveTypeNameByDataParser.get(currentDataParser);

			return nextPush(
				lastValue,
				factory.createVariableStatement(
					[factory.createToken(SyntaxKind.ExportKeyword)],
					factory.createVariableDeclarationList(
						[
							factory.createVariableDeclaration(
								contextValue.constName,
								undefined,
								recursiveTypeName
									? factory.createTypeReferenceNode(
										factory.createQualifiedName(
											dependencyIdentifier,
											factory.createIdentifier("DataParser"),
										),
										[factory.createTypeReferenceNode(recursiveTypeName)],
									)
									: undefined,
								contextValue.expression,
							),
						],
						NodeFlags.Const,
					),
				),
			);
		},
	);

	const sourceFile = createSourceFile("print.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
	const printer = createPrinter();

	return pipe(
		[
			...importClauseTransformer(importClause),
			...TST.importTypesTransformer(importType),
			...recursiveTypeAliasDeclarations,
			...dataParserConstStatements,
		],
		A.map(
			(value) => printer.printNode(
				EmitHint.Unspecified,
				value,
				sourceFile,
			),
		),
		A.join("\n\n"),
		S.trim,
	);
}
