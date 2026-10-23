import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  family: 4,
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function inspect() {
  console.log("=== DATABASE INSPECTION ===");
  const employees = await prisma.employee.findMany({
    include: {
      role: true,
      department: true,
    },
    orderBy: { employeeCode: "asc" },
  });

  console.log(`\nEmployees (${employees.length}):`);
  for (const emp of employees) {
    console.log(`- [${emp.employeeCode}] ${emp.fullName} (${emp.email}) | Role: ${emp.role.name} | Dept: ${emp.department?.code || "N/A"}`);
  }

  const attendanceCount = await prisma.attendance.count();
  const sessionCount = await prisma.attendanceSession.count();
  const breakCount = await prisma.break.count();
  const activityLogCount = await prisma.activityLog.count();
  const auditLogCount = await prisma.auditLog.count();
  const leaveCount = await prisma.leave.count();
  const odCount = await prisma.onDutyRequest.count();

  console.log(`\nAttendance count: ${attendanceCount}`);
  console.log(`AttendanceSession count: ${sessionCount}`);
  console.log(`Break count: ${breakCount}`);
  console.log(`ActivityLog count: ${activityLogCount}`);
  console.log(`AuditLog count: ${auditLogCount}`);
  console.log(`Leave count: ${leaveCount}`);
  console.log(`OnDutyRequest count: ${odCount}`);

  const activities = await prisma.activityLog.findMany({
    select: { id: true, action: true, description: true, employeeId: true },
  });
  console.log("\nActivity Logs:", activities);

  const audits = await prisma.auditLog.findMany({
    select: { id: true, action: true, description: true, employeeId: true },
  });
  console.log("\nAudit Logs:", audits);

  // Distinct dates in Attendance table
  const dates = await prisma.attendance.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "asc" },
  });
  console.log("\nDistinct Attendance Dates:");
  for (const d of dates) {
    console.log(`- ${d.date.toISOString().split("T")[0]}`);
  }

  await prisma.$disconnect();
  await pool.end();
}

inspect().catch(console.error);
