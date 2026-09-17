import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";

config();

async function run() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    ssl: connectionString?.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  await prisma.agentDevice.updateMany({
    data: { status: "ACTIVE", revokedAt: null }
  });
  console.log("Devices activated.");
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
