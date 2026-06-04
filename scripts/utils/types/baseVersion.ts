import { type NeverCoalescing, type DP, type SymbolKind } from "@duplojs/utils";

export type BaseVersion<
	GenericDataParser extends DP.DataParser,
> = NeverCoalescing<
	Extract<
		DP.DataParsers,
		{
			[Prop in SymbolKind]: Omit<
				GenericDataParser[SymbolKind],
				| typeof DP.dataParserKind.definition.name
				| typeof DP.dataParserExtendedKind.definition.name
			>
		}
	>,
	DP.DataParser
>;
