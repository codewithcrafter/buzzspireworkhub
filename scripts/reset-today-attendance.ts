/**
 * RESET SCRIPT: Deletes today's attendance records to allow testing a fresh session.
 * Run with: npx tsx scripts/reset-today-attendance.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  max: 5,
  family: 4,
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TIMEZONE = "Asia/Kolkata";

function getStartOfDay(date?: Date): Date {
  const d = date ?? new Date();
  const kolkataStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const [year, month, day] = kolkataStr.split("-").map(Number);
  const utcMidnight = new Date(Date.UTC(year!, month! - 1, day!, 0, 0, 0, 0));
  return new Date(utcMidnight.getTime() - 19800000);
}

function getEndOfDay(date?: Date): Date {
  return new Date(getStartOfDay(date).getTime() + 24 * 60 * 60 * 1000 - 1);
}

async function main() {
  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  console.log(`Deleting attendance records between:`);
  console.log(`Start: ${startOfDay.toISOString()}`);
  console.log(`End:   ${endOfDay.toISOString()}`);

  const attendances = await prisma.attendance.findMany({
    where: { date: { gte: startOfDay, lte: endOfDay } },
    select: { id: true },
  });

  if (attendances.length === 0) {
    console.log("No attendance records found for today. Nothing to delete.");
  } else {
    const ids = attendances.map((a) => a.id);
    
    // Delete cascading references manually if Prisma schema doesn't handle it,
    // but Prisma typically handles cascade if defined.
    // We will delete breaks, then sessions, then attendance.

    const sessions = await prisma.attendanceSession.findMany({
      where: { attendanceId: { in: ids } },
      select: { id: true },
    });
    const sessionIds = sessions.map((s) => s.id);

    if (sessionIds.length > 0) {
      const deletedBreaks = await prisma.break.deleteMany({
        where: { attendanceSessionId: { in: sessionIds } },
      });
      console.log(`Deleted ${deletedBreaks.count} breaks.`);

      const deletedSessions = await prisma.attendanceSession.deleteMany({
        where: { id: { in: sessionIds } },
      });
      console.log(`Deleted ${deletedSessions.count} sessions.`);
    }

    const deletedAtt = await prisma.attendance.deleteMany({
      where: { id: { in: ids } },
    });
    console.log(`Deleted ${deletedAtt.count} attendance records.`);
  }

  console.log("Reset complete. The dashboard will now show OFF DUTY.");
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
