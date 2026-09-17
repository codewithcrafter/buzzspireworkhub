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

  console.log("=== SETUP TEST EMPLOYEE AND DEVICE ===");
  const employee = await prisma.employee.findFirst({ where: { status: "ACTIVE" } });
  if (!employee) throw new Error("No active employee found");
  
  const testDate = new Date();
  
  // Create Device
  let device = await prisma.agentDevice.findFirst({ where: { employeeId: employee.id } });
  if (!device) {
    device = await prisma.agentDevice.create({
      data: {
        deviceId: "test-device-id",
        employeeId: employee.id,
        credential: "test-credential-token",
        deviceName: "Test-PC",
      }
    });
  }

  // Inject standard Agent Events
  const agentEvents = [
    {
      eventType: "WEBSITE_ACTIVITY",
      domain: "google.com",
      startedAt: new Date(testDate.getTime() + 60000).toISOString(),
      endedAt: new Date(testDate.getTime() + 300000).toISOString(),
      durationSeconds: 240,
      timestamp: new Date(testDate.getTime() + 300000).toISOString()
    },
    {
      eventType: "WEBSITE_ACTIVITY",
      domain: "youtube.com", // normalized
      startedAt: new Date(testDate.getTime() + 300000).toISOString(),
      endedAt: new Date(testDate.getTime() + 720000).toISOString(),
      durationSeconds: 420,
      timestamp: new Date(testDate.getTime() + 720000).toISOString()
    },
    {
      eventType: "APPLICATION_ACTIVITY",
      applicationName: "VS Code",
      windowTitle: "my-project - Visual Studio Code",
      startedAt: new Date(testDate.getTime() + 720000).toISOString(),
      endedAt: new Date(testDate.getTime() + 1500000).toISOString(),
      durationSeconds: 780,
      timestamp: new Date(testDate.getTime() + 1500000).toISOString()
    },
    {
      eventType: "IDLE_STATE",
      state: "IDLE",
      startedAt: new Date(testDate.getTime() + 2400000).toISOString(),
      endedAt: new Date(testDate.getTime() + 3120000).toISOString(),
      durationSeconds: 720,
      timestamp: new Date(testDate.getTime() + 3120000).toISOString()
    }
  ];

  // Ingest events
  console.log("== POSTING EVENTS ==");
  const res = await fetch("http://localhost:3000/api/activity/agent/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${device.credential}`
    },
    body: JSON.stringify({ events: agentEvents })
  });
  console.log("Ingest Response:", await res.json());

  // Wait a sec
  await new Promise(r => setTimeout(r, 1000));

  // Query Timeline API direct via tsx
  const { TimelineService } = await import("./src/services/timeline.service");
  
  const timeline = await TimelineService.getEmployeeTimeline(employee.id, testDate);
  
  console.log("== TIMELINE EVENT RESULTS ==");
  timeline.forEach((ev: any) => {
    console.log(`[${ev.eventType}] ${ev.title} (${ev.durationSeconds}s) | Source: ${ev.source} | Device: ${ev.metadata?.deviceName || 'N/A'}`);
  });

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
