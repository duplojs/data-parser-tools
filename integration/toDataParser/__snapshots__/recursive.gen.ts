import * as DP from "@duplojs/utils/dataParser";

export type RecursiveType0 = {
    id: string;
    replies: RecursiveType0[];
};

export type $recursiveDataParser2 = RecursiveType0;

export type RecursiveType2 = [
    string,
    RecursiveType2[]
];

export type $recursiveDataParser4 = RecursiveType2;

export type RecursiveType4 = {
    name: string;
    children: RecursiveType4[];
    comment: RecursiveType0;
    meta: RecursiveType2;
};

export type $recursiveDataParser0 = RecursiveType4;

export const recursiveDataParser0: DP.DataParser<$recursiveDataParser0> = DP.object({
    name: DP.string(),
    children: DP.array(DP.lazy(() => recursiveDataParser0)),
    comment: DP.lazy(() => recursiveDataParser2),
    meta: DP.lazy(() => recursiveDataParser4)
});

export const recursiveDataParser2: DP.DataParser<$recursiveDataParser2> = DP.object({
    id: DP.string(),
    replies: DP.array(DP.lazy(() => recursiveDataParser2))
});

export const recursiveDataParser4: DP.DataParser<$recursiveDataParser4> = DP.tuple([DP.string(), DP.array(DP.lazy(() => recursiveDataParser4))]);

export const recursiveNodeDataParser = recursiveDataParser0;
