import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ [Prisma Client Error]: DATABASE_URL is not defined in environment variables. Check your .env file!");
  }
  const isNeon = connectionString?.includes("neon.tech");
  const pool = new Pool({
    connectionString,
    ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    max: 10,
    allowExitOnIdle: true,
    family: 4, // Force IPv4 to fix Node DNS resolution bug with Neon `.c-2` domains
  } as any);
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaSuperFresh: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prismaSuperFresh ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaSuperFresh = prisma;
