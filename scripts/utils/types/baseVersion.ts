import { type NeverCoalescing, type DP, type GetKind, type Kind } from "@duplojs/utils";

export type BaseVersion<
	GenericDataParser extends DP.DataParser,
> = GenericDataParser extends any
	? NeverCoalescing<
		Extract<
			DP.DataParsers,
			GetKind<GenericDataParser>[keyof GetKind<GenericDataParser>] extends infer InferredAllKind
				? {
					[Prop in keyof InferredAllKind]: Prop extends string
						? Prop extends (
							| typeof DP.dataParserKind.definition.name
							| typeof DP.extendedKind.definition.name
						)
							? never
							: Kind<{
								name: Prop;
								value: InferredAllKind[Prop];
							}>
						: never
				}[keyof InferredAllKind]
				: never
		>,
		DP.DataParser
	>
	: never;
