import * as DP from "@duplojs/utils/dataParser";

export type RecursiveType0 = {
    name: string;
    children: RecursiveType0[];
    comment: {
        id: string;
        replies: RecursiveType1[];
    };
    meta: [
        string,
        RecursiveType2[]
    ];
};

export type RecursiveType1 = {
    id: string;
    replies: RecursiveType1[];
};

export type RecursiveType2 = [
    string,
    RecursiveType2[]
];

export type RecursiveNode = RecursiveType0;

export const recursiveDataParser1: DP.DataParser<RecursiveType1> = DP.object({
    id: DP.string(),
    replies: DP.array(DP.lazy(() => recursiveDataParser1))
});

export const recursiveDataParser2: DP.DataParser<RecursiveType2> = DP.tuple([DP.string(), DP.array(DP.lazy(() => recursiveDataParser2))]);

export const recursiveNodeDataParser: DP.DataParser<RecursiveNode> = DP.object({
    name: DP.string(),
    children: DP.array(DP.lazy(() => recursiveNodeDataParser)),
    comment: DP.object({
        id: DP.string(),
        replies: DP.array(DP.lazy(() => recursiveDataParser1))
    }),
    meta: DP.tuple([DP.string(), DP.array(DP.lazy(() => recursiveDataParser2))])
});