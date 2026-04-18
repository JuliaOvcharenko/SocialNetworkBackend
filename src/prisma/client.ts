import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient as PC } from "../../generated/prisma/client";
import { env } from "../config/env";

const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });

export const prisma = new PC({
    adapter,
});