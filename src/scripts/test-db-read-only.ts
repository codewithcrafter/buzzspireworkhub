import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  console.log("DATABASE_URL LOADED:", process.env.DATABASE_URL ? "YES" : "NO");

  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  
  // Safely identify the host without exposing credentials
  try {
    const parsedUrl = new URL(connectionString);
    console.log("CONNECTED HOST:", parsedUrl.hostname);
    console.log("CONNECTED DB:", parsedUrl.pathname.replace("/", ""));
  } catch (e) {
    console.log("Could not parse DATABASE_URL to extract host securely.");
  }

  const isNeon = connectionString?.includes("neon.tech");
  const pool = new Pool({
    connectionString,
    ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    max: 2,
    family: 4,
  } as any);

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("\nAttempting Neon connection...");
    
    // 1. Get existing tables
    const tables: any[] = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;
    const tableNames = tables.map((t: any) => t.tablename);
    console.log("CONNECTION: SUCCESS");
    
    console.log("\nEXISTING TABLE COUNT:", tableNames.length);
    if (tableNames.length > 0) {
      console.log("EXISTING TABLES:", tableNames);
    } else {
      console.log("DATABASE IS EMPTY.");
    }

  } catch (error: any) {
    console.log("CONNECTION: FAILED");
    console.error("\nERROR CODE:", error.code);
    console.error("ERROR MESSAGE:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
