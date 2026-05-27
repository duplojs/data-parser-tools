import * as DP from "@duplojs/utils/dataParser";

export type RecursiveType0 = {
    id: string;
    replies: RecursiveType0[];
};

export type $recursive1DataParser = RecursiveType0;

export type RecursiveType2 = [
    string,
    RecursiveType2[]
];

export type $recursive2DataParser = RecursiveType2;

export type RecursiveType4 = {
    name: string;
    children: RecursiveType4[];
    comment: RecursiveType0;
    meta: RecursiveType2;
};

export type $recursive0DataParser = RecursiveType4;

export const recursive1DataParser: DP.DataParser<$recursive1DataParser> = DP.object({
    id: DP.string(),
    replies: DP.array(DP.lazy(() => recursive1DataParser))
});

export const recursive2DataParser: DP.DataParser<$recursive2DataParser> = DP.tuple([DP.string(), DP.array(DP.lazy(() => recursive2DataParser))]);

export const recursive0DataParser: DP.DataParser<$recursive0DataParser> = DP.object({
    name: DP.string(),
    children: DP.array(DP.lazy(() => recursive0DataParser)),
    comment: DP.lazy(() => recursive1DataParser),
    meta: DP.lazy(() => recursive2DataParser)
});

export const recursiveNodeDataParser = recursive0DataParser;