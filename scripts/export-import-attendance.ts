/**
 * BUZZSPIRE WORKHUB - ATTENDANCE & BREAK DATA EXPORT/IMPORT UTILITY
 *
 * Facilitates synchronizing attendance, session, and break records between
 * production/staging and local development environments.
 *
 * Usage:
 *   1. Export from active database to JSON dump:
 *      npx tsx scripts/export-import-attendance.ts --export [--date=2026-10-17] [--out=data/attendance-export.json]
 *
 *   2. Import from JSON dump into local database:
 *      npx tsx scripts/export-import-attendance.ts --import [--file=data/attendance-export.json]
 *
 *   3. Seed built-in realistic mock attendance records:
 *      npx tsx scripts/export-import-attendance.ts --seed
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getStartOfDay, getEndOfDay } from "../src/lib/date";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon.tech") || connectionString.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  family: 4,
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ExportData {
  exportedAt: string;
  source: string;
  filterDate?: string;
  departments: any[];
  breakTypes: any[];
  employees: any[];
  attendances: any[];
}

async function exportData(targetDate?: string, outputPath?: string) {
  console.log("🚀 Starting attendance & break data export...");
  const exportFile = outputPath || path.join(process.cwd(), "data", "attendance-export.json");
  
  const whereAtt: any = {};
  if (targetDate) {
    const start = getStartOfDay(targetDate);
    const end = getEndOfDay(targetDate);
    whereAtt.date = { gte: start, lte: end };
    console.log(`Filtering for date: ${targetDate} (${start.toISOString()} to ${end.toISOString()})`);
  }

  const [departments, breakTypes, employees, attendances] = await Promise.all([
    prisma.department.findMany(),
    prisma.breakType.findMany(),
    prisma.employee.findMany({
      where: { role: { name: { not: "ADMIN" } } },
      select: {
        id: true,
        employeeId: true,
        employeeCode: true,
        fullName: true,
        email: true,
        phone: true,
        departmentId: true,
        designation: true,
        status: true,
        roleId: true,
      },
    }),
    prisma.attendance.findMany({
      where: whereAtt,
      include: {
        sessions: {
          include: {
            breaks: true,
          },
        },
      },
    }),
  ]);

  const payload: ExportData = {
    exportedAt: new Date().toISOString(),
    source: connectionString?.split("@")[1] || "PostgreSQL",
    filterDate: targetDate,
    departments,
    breakTypes,
    employees,
    attendances,
  };

  const dir = path.dirname(exportFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(exportFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`✅ Successfully exported:`);
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Break Types: ${breakTypes.length}`);
  console.log(`   - Employees:   ${employees.length}`);
  console.log(`   - Attendances: ${attendances.length}`);
  console.log(`📁 File saved to: ${exportFile}\n`);
}

async function importData(inputPath?: string) {
  const importFile = inputPath || path.join(process.cwd(), "data", "attendance-export.json");
  if (!fs.existsSync(importFile)) {
    console.error(`❌ Export dump file not found at: ${importFile}`);
    process.exit(1);
  }

  console.log(`🚀 Starting data import from: ${importFile}...`);
  const raw = fs.readFileSync(importFile, "utf-8");
  const data: ExportData = JSON.parse(raw);

  console.log(`Export timestamp: ${data.exportedAt} (Source: ${data.source})`);

  // 1. Upsert Departments
  for (const dept of data.departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, manager: dept.manager, description: dept.description },
      create: { code: dept.code, name: dept.name, manager: dept.manager, description: dept.description, status: dept.status || "ACTIVE" },
    });
  }

  // 2. Upsert Break Types
  for (const bt of data.breakTypes) {
    await prisma.breakType.upsert({
      where: { name: bt.name },
      update: { description: bt.description },
      create: { name: bt.name, description: bt.description, status: bt.status || "ACTIVE" },
    });
  }

  // 3. Upsert Attendance Records, Sessions, and Breaks
  let importedAtt = 0;
  let importedSess = 0;
  let importedBreaks = 0;

  for (const att of data.attendances) {
    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: att.employeeId,
          date: new Date(att.date),
        },
      },
      include: { sessions: { include: { breaks: true } } },
    });

    if (existing) {
      for (const s of existing.sessions) {
        await prisma.break.deleteMany({ where: { attendanceSessionId: s.id } });
      }
      await prisma.attendanceSession.deleteMany({ where: { attendanceId: existing.id } });
      await prisma.attendance.delete({ where: { id: existing.id } });
    }

    const createdAtt = await prisma.attendance.create({
      data: {
        employeeId: att.employeeId,
        date: new Date(att.date),
        checkIn: att.checkIn ? new Date(att.checkIn) : null,
        checkOut: att.checkOut ? new Date(att.checkOut) : null,
        status: att.status,
        isLate: att.isLate ?? false,
        lateMinutes: att.lateMinutes ?? 0,
        totalWorkingSeconds: att.totalWorkingSeconds ?? 0,
        totalBreakSeconds: att.totalBreakSeconds ?? 0,
        netWorkingSeconds: att.netWorkingSeconds ?? 0,
        idleSeconds: att.idleSeconds ?? 0,
      },
    });
    importedAtt++;

    for (const sess of att.sessions || []) {
      const createdSess = await prisma.attendanceSession.create({
        data: {
          attendanceId: createdAtt.id,
          employeeId: att.employeeId,
          punchIn: new Date(sess.punchIn),
          punchOut: sess.punchOut ? new Date(sess.punchOut) : null,
          workingSeconds: sess.workingSeconds ?? 0,
        },
      });
      importedSess++;

      for (const brk of sess.breaks || []) {
        await prisma.break.create({
          data: {
            attendanceSessionId: createdSess.id,
            breakTypeId: brk.breakTypeId,
            purpose: brk.purpose,
            startTime: new Date(brk.startTime),
            endTime: brk.endTime ? new Date(brk.endTime) : null,
            durationSeconds: brk.durationSeconds ?? 0,
          },
        });
        importedBreaks++;
      }
    }
  }

  console.log(`✅ Import finished successfully!`);
  console.log(`   - Attendance Records: ${importedAtt}`);
  console.log(`   - Sessions:           ${importedSess}`);
  console.log(`   - Breaks:             ${importedBreaks}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const isExport = args.includes("--export");
  const isImport = args.includes("--import");
  const isSeed = args.includes("--seed");

  const dateArg = args.find((a) => a.startsWith("--date="))?.split("=")[1];
  const fileArg = args.find((a) => a.startsWith("--file="))?.split("=")[1] ||
                  args.find((a) => a.startsWith("--out="))?.split("=")[1];

  if (isExport) {
    await exportData(dateArg, fileArg);
  } else if (isImport) {
    await importData(fileArg);
  } else if (isSeed) {
    const { syncAttendanceData } = await import("./sync-attendance-data");
    await syncAttendanceData();
  } else {
    console.log(`
Usage:
  npx tsx scripts/export-import-attendance.ts --export [--date=YYYY-MM-DD] [--out=path.json]
  npx tsx scripts/export-import-attendance.ts --import [--file=path.json]
  npx tsx scripts/export-import-attendance.ts --seed
    `);
  }
}

main()
  .catch((e) => {
    console.error("❌ Operation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
