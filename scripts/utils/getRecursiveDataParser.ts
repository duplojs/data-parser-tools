import { DP, A, G, pipe, P, O, hasSomeKinds } from "@duplojs/utils";

export function getRecursiveDataParser(schema: DP.DataParsers): DP.DataParser[] {
	const countMap = new Map<DP.DataParser, number>();

	void (function countDataParser(schema: DP.DataParsers) {
		P.match(schema)
			.when(
				hasSomeKinds([
					DP.stringKind,
					DP.stringKind,
					DP.numberKind,
					DP.nilKind,
					DP.dateKind,
					DP.emptyKind,
					DP.bigIntKind,
					DP.booleanKind,
					DP.literalKind,
					DP.unknownKind,
					DP.templateLiteralKind,
					DP.recordKind,
				]),
				() => void 0,
			)
			.when(
				hasSomeKinds([
					DP.nullableKind,
					DP.optionalKind,
					DP.recoverKind,
					DP.transformKind,
				]),
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
						dataParser.definition.options,
						countDataParser,
					);

					if (countMap.get(dataParser) === 1) {
						countMap.delete(dataParser);
					}
				},
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

					if (countMap.get(dataParser) === 1) {
						countMap.delete(dataParser);
					}
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

					if (countMap.get(dataParser) === 1) {
						countMap.delete(dataParser);
					}
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

					if (countMap.get(dataParser) === 1) {
						countMap.delete(dataParser);
					}
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
