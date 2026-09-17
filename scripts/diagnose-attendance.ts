/**
 * DIAGNOSTIC: inspect today's attendance records
 * Run with: npx tsx scripts/diagnose-attendance.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load env variables
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL not set in .env");
  process.exit(1);
}

console.log("DATABASE_URL starts with:", connectionString.slice(0, 40) + "...");

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

function fmtIST(d: Date | null | undefined): string {
  if (!d) return "null";
  return new Date(d).toLocaleString("en-IN", { timeZone: TIMEZONE, hour12: true });
}

async function main() {
  const now = new Date();
  const startOfDay = getStartOfDay(now);
  const endOfDay = getEndOfDay(now);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  BUZZSPIRE WORKHUB — ATTENDANCE DIAGNOSTIC");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Current UTC:        ${now.toISOString()}`);
  console.log(`  Current IST:        ${fmtIST(now)}`);
  console.log(`  Today window start: ${startOfDay.toISOString()} (${fmtIST(startOfDay)} IST)`);
  console.log(`  Today window end:   ${endOfDay.toISOString()} (${fmtIST(endOfDay)} IST)`);
  console.log("═══════════════════════════════════════════════════════\n");

  // All active employees
  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE" },
    include: { role: true, department: true },
    orderBy: { fullName: "asc" },
  });
  console.log(`Active employees (${employees.length}):`);
  for (const e of employees) {
    console.log(`  [${e.role?.name}] ${e.fullName} (${e.employeeCode}) — dept: ${e.department?.name ?? "None"}`);
  }

  // TODAY's attendance records
  const attendances = await prisma.attendance.findMany({
    where: { date: { gte: startOfDay, lte: endOfDay } },
    include: {
      employee: { include: { role: true } },
      sessions: {
        orderBy: { createdAt: "asc" },
        include: {
          breaks: {
            orderBy: { createdAt: "asc" },
            include: { breakType: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\nToday's Attendance records (${attendances.length}):\n`);
  for (const att of attendances) {
    const isAdmin = att.employee.role?.name === "ADMIN";
    console.log(`┌──────────────────────────────────────────────────────────`);
    console.log(`│ Employee:    ${att.employee.fullName} (${att.employee.employeeCode})`);
    console.log(`│ Role:        ${att.employee.role?.name}${isAdmin ? " ⚠️  ADMIN — should NOT have attendance!" : ""}`);
    console.log(`│ Att.ID:      ${att.id}`);
    console.log(`│ date (UTC):  ${att.date.toISOString()}`);
    console.log(`│ date (IST):  ${fmtIST(att.date)}`);
    console.log(`│ Status:      ${att.status}`);
    console.log(`│ checkIn:     ${fmtIST(att.checkIn)}`);
    console.log(`│ checkOut:    ${fmtIST(att.checkOut)}`);
    console.log(`│ totalWork:   ${att.totalWorkingSeconds}s = ${Math.round((att.totalWorkingSeconds ?? 0) / 60)} min`);
    console.log(`│ totalBreak:  ${att.totalBreakSeconds}s = ${Math.round((att.totalBreakSeconds ?? 0) / 60)} min`);
    console.log(`│ netWork:     ${att.netWorkingSeconds}s = ${Math.round((att.netWorkingSeconds ?? 0) / 60)} min`);
    console.log(`│ Sessions:    ${att.sessions.length}`);

    for (const [si, sess] of att.sessions.entries()) {
      const isOpen = !sess.punchOut;
      console.log(`│  Session[${si}]: ${sess.id.slice(-12)}`);
      console.log(`│    punchIn:  ${fmtIST(sess.punchIn)}`);
      console.log(`│    punchOut: ${isOpen ? "⚠️  OPEN (no punchOut)" : fmtIST(sess.punchOut)}`);
      console.log(`│    working:  ${sess.workingSeconds}s`);
      if (sess.breaks.length === 0) {
        console.log(`│    breaks:   none`);
      }
      for (const [bi, b] of sess.breaks.entries()) {
        const isOpenBreak = !b.endTime;
        console.log(`│    Break[${bi}]: ${b.breakType?.name ?? "Unknown"}`);
        console.log(`│      startTime: ${fmtIST(b.startTime)}`);
        console.log(`│      endTime:   ${isOpenBreak ? "⚠️  OPEN (active)" : fmtIST(b.endTime)}`);
        console.log(`│      duration:  ${b.durationSeconds}s`);
      }
    }
    console.log(`└──────────────────────────────────────────────────────────\n`);
  }

  // Any open sessions (today or other days)
  const openSessions = await prisma.attendanceSession.findMany({
    where: { punchOut: null },
    include: {
      employee: { include: { role: true } },
      attendance: true,
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(`\n⚠️  All open sessions (punchOut=null) across ALL dates: ${openSessions.length}`);
  for (const s of openSessions) {
    console.log(`  → ${s.employee?.fullName} (${s.employee?.role?.name}) | punchIn IST: ${fmtIST(s.punchIn)} | attDate IST: ${fmtIST(s.attendance?.date)}`);
  }

  // Active breaks
  const activeBreaks = await prisma.break.findMany({
    where: { endTime: null },
    include: {
      breakType: true,
      attendanceSession: { include: { employee: true } },
    },
  });
  console.log(`\n⚠️  Active breaks (endTime=null): ${activeBreaks.length}`);
  for (const b of activeBreaks) {
    console.log(`  → ${b.attendanceSession?.employee?.fullName} | Type: ${b.breakType?.name} | startTime: ${fmtIST(b.startTime)}`);
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  DIAGNOSTIC COMPLETE");
  console.log("═══════════════════════════════════════════════════════\n");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("Diagnostic failed:", e);
  prisma.$disconnect();
  pool.end();
  process.exit(1);
});
