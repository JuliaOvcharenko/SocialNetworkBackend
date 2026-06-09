import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PC } from "../../generated/prisma/client";
import { Pool } from "pg";
import { env } from "../config/env";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 6,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    allowExitOnIdle: true,
});

pool.on("error", (err) => {
    console.error("Unexpected pool error", err);
});

const adapter = new PrismaPg(pool);

export const prisma = new PC({ adapter });