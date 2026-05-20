import * as DP from "@duplojs/utils/dataParser";

export const userRoleDataParser = DP.literal(["admin", "editor", "viewer"]);

export const userDataParser = DP.object({
    id: DP.templateLiteral(["user-", DP.number(), "-db1"]),
    name: DP.string({ checkers: [DP.checkerStringMin(2)] }),
    email: DP.string({ checkers: [DP.checkerEmail()] }),
    role: userRoleDataParser
});