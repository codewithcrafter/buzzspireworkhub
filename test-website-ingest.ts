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

  const device = await prisma.agentDevice.findFirst({
    where: { status: "ACTIVE" }
  });

  if (!device) {
    console.error("No active device found!");
    process.exit(1);
  }

  console.log("Mocking WEBSITE_ACTIVITY for device:", device.deviceId);

  const res = await fetch("http://localhost:3000/api/activity/agent/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${device.credential}`
    },
    body: JSON.stringify({
      events: [
        {
          eventType: "WEBSITE_ACTIVITY",
          domain: "github.com",
          startedAt: new Date(Date.now() - 120000).toISOString(),
          endedAt: new Date().toISOString(),
          durationSeconds: 120,
          timestamp: new Date().toISOString()
        }
      ]
    })
  });

  const text = await res.text();
  console.log("Ingestion API Response:", res.status, text);

  // verify DB
  const logs = await prisma.activityLog.findMany({
    where: { action: "WEBSITE_ACTIVITY" },
    orderBy: { createdAt: "desc" },
    take: 1
  });
  console.log("Found WEBSITE_ACTIVITY logs:", logs);

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
