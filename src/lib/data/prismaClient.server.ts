import { PrismaClient } from "@prisma/client";
import type { PrismaClientOptions } from "@prisma/client/runtime";

const logLevels: PrismaClientOptions["log"] = ["error", "warn", "info"];
/*if (import.meta.env.DEV) {
    logLevels.push("query");
}*/

export const prismaClient = new PrismaClient({ log: logLevels });
