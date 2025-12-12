import { DP, A, G, pipe, P, O } from "@duplojs/utils";

export function getRecursiveDataParser(schema: DP.DataParsers): DP.DataParser[] {
	const countMap = new Map<DP.DataParser, number>();

	void (function countDataParser(schema: DP.DataParsers) {
		P.match(schema)
			.when(
				(value) => (
					DP.stringKind.has(value)
					|| DP.stringKind.has(value)
					|| DP.numberKind.has(value)
					|| DP.nilKind.has(value)
					|| DP.dateKind.has(value)
					|| DP.emptyKind.has(value)
					|| DP.bigIntKind.has(value)
					|| DP.booleanKind.has(value)
					|| DP.literalKind.has(value)
					|| DP.unknownKind.has(value)
					|| DP.templateLiteralKind.has(value)
					|| DP.recordKind.has(value)
				),
				() => void 0,
			)
			.when(
				(value) => (
					DP.nullableKind.has(value)
					|| DP.optionalKind.has(value)
					|| DP.recoverKind.has(value)
					|| DP.transformKind.has(value)
				),
				(dataParser) => void countDataParser(dataParser.definition.inner),
			)
			.when(
				DP.lazyKind.has,
				(dataParser) => void countDataParser(dataParser.definition.getter.value),
			)
			.when(
				DP.pipeKind.has,
				(dataParser) => {
					countDataParser(dataParser.definition.input);
					countDataParser(dataParser.definition.output);
				},
			)
			.when(
				DP.unionKind.has,
				(dataParser) => A.map(
					dataParser.definition.options,
					countDataParser,
				),
			)
			.when(
				DP.arrayKind.has,
				(dataParser) => {
					const count = (countMap.get(dataParser) ?? 0) + 1;

					countMap.set(
						dataParser,
						count,
					);

					if (count > 1) {
						return;
					}

					countDataParser(dataParser.definition.element);
				},
			)
			.when(
				DP.objectKind.has,
				(dataParser) => {
					const count = (countMap.get(dataParser) ?? 0) + 1;

					countMap.set(
						dataParser,
						count,
					);

					if (count > 1) {
						return;
					}

					pipe(
						dataParser.definition.shape,
						O.entries,
						A.map(([, value]) => void countDataParser(value)),
					);
				},
			)
			.when(
				DP.tupleKind.has,
				(dataParser) => {
					const count = (countMap.get(dataParser) ?? 0) + 1;

					countMap.set(
						dataParser,
						count,
					);

					if (count > 1) {
						return;
					}

					A.map(
						dataParser.definition.shape,
						countDataParser,
					);
				},
			)
			.when(DP.dataParserKind.has, () => void 0)
			.exhaustive();
	})(schema);

	return pipe(
		countMap.entries(),
		G.filter(([, value]) => value > 1),
		G.map(([key]) => key),
		A.from,
	);
}
