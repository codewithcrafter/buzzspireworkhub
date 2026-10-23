/**
 * BUZZSPIRE WORKHUB - TEST & MOCK DATA CLEANUP SCRIPT
 *
 * Safely removes test attendance records, sessions, breaks, dummy employee logs,
 * and test employees without breaking foreign keys or affecting core configuration.
 *
 * Preserves:
 *  - System Administrator account (ADM001 / admin@buzzspireworkhub.com)
 *  - All Roles (ADMIN, EMPLOYEE, MANAGER, HR_MANAGER)
 *  - All Departments (ENG, DES, MKT, HR, OPS, etc.)
 *  - All Break Types (Lunch, Tea / Coffee, Washroom, Calls, Meeting, Shoot, Other)
 *  - All System Settings (work hours, grace periods, max break durations, etc.)
 *  - Legacy agency/client data (User, Lead, Project, Invoice)
 *
 * Usage:
 *  npx tsx scripts/cleanup-test-data.ts              # Full cleanup: attendance + test employees
 *  npx tsx scripts/cleanup-test-data.ts --attendance-only # Clears attendance & breaks only
 *  npx tsx scripts/cleanup-test-data.ts --dry-run    # Previews what would be deleted
 */

import "dotenv/config";
import { PrismaClient, RoleName } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

const isNeon = connectionString.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  family: 4,
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const isDryRun = process.argv.includes("--dry-run");
const isAttendanceOnly = process.argv.includes("--attendance-only");

export async function cleanupTestData() {
  console.log("=================================================================");
  console.log("     BUZZSPIRE WORKHUB — TEST & MOCK DATA CLEANUP ENGINE");
  console.log("=================================================================");
  if (isDryRun) {
    console.log("⚠️  MODE: DRY-RUN (Previewing deletions only, no changes will be made)\n");
  } else if (isAttendanceOnly) {
    console.log("ℹ️  MODE: ATTENDANCE-ONLY (Clearing breaks, sessions & attendance logs)\n");
  } else {
    console.log("ℹ️  MODE: FULL CLEANUP (Clearing test attendance, logs & test employees)\n");
  }

  // 1. Locate and protect Admin account
  console.log("1. Verifying System Administrator protection...");
  const adminRole = await prisma.role.findFirst({
    where: { name: RoleName.ADMIN },
  });

  const adminEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        { employeeCode: "ADM001" },
        { email: "admin@buzzspireworkhub.com" },
        adminRole ? { roleId: adminRole.id } : {},
      ],
    },
    include: { role: true, department: true },
  });

  if (!adminEmployee) {
    throw new Error(
      "❌ CRITICAL SAFETY ABORT: Admin employee (ADM001) could not be located in database. Deletion cancelled to prevent lockout."
    );
  }

  console.log(`   ✓ Protected Admin Account: [${adminEmployee.employeeCode}] ${adminEmployee.fullName} (${adminEmployee.email})`);
  console.log(`   ✓ Admin Role: ${adminEmployee.role.name} | Dept: ${adminEmployee.department?.name ?? "None"}`);

  // 2. Identify test employees (all employees EXCEPT the admin)
  const testEmployees = await prisma.employee.findMany({
    where: {
      id: { not: adminEmployee.id },
      employeeCode: { not: "ADM001" },
      email: { not: "admin@buzzspireworkhub.com" },
    },
    select: {
      id: true,
      employeeCode: true,
      fullName: true,
      email: true,
    },
  });

  const testEmployeeIds = testEmployees.map((e) => e.id);
  console.log(`   ✓ Found ${testEmployees.length} test employee(s) slated for evaluation.`);
  for (const emp of testEmployees) {
    console.log(`     - [${emp.employeeCode}] ${emp.fullName} (${emp.email})`);
  }

  // 3. Count records queued for deletion
  console.log("\n2. Counting records targeted for removal...");
  const breakCount = await prisma.break.count();
  const sessionCount = await prisma.attendanceSession.count();
  const attendanceCount = await prisma.attendance.count();

  // Test employee specific logs
  const activityLogTargetCount = isAttendanceOnly
    ? await prisma.activityLog.count({
        where: {
          action: { in: ["PUNCH_IN", "PUNCH_OUT", "BREAK_STARTED", "BREAK_ENDED", "BREAK_AUTO_CLOSED", "ATTENDANCE_AUTO_CLOSED"] },
        },
      })
    : await prisma.activityLog.count({
        where: {
          OR: [
            { employeeId: { in: testEmployeeIds } },
            { action: { in: ["PUNCH_IN", "PUNCH_OUT", "BREAK_STARTED", "BREAK_ENDED", "BREAK_AUTO_CLOSED", "ATTENDANCE_AUTO_CLOSED"] } },
          ],
        },
      });

  const auditLogTargetCount = isAttendanceOnly
    ? await prisma.auditLog.count({
        where: { module: "ATTENDANCE" },
      })
    : await prisma.auditLog.count({
        where: {
          OR: [
            { employeeId: { in: testEmployeeIds } },
            { performedById: { in: testEmployeeIds } },
            { module: "ATTENDANCE" },
          ],
          // Ensure admin security logs are never touched
          NOT: {
            employeeId: adminEmployee.id,
            action: { in: ["LOGIN_SUCCESS", "LOGIN_FAILED_PASSWORD", "ADMIN_ACTION"] },
          },
        },
      });

  const loginSessionCount = testEmployeeIds.length > 0
    ? await prisma.loginSession.count({ where: { employeeId: { in: testEmployeeIds } } })
    : 0;

  const employmentHistoryCount = testEmployeeIds.length > 0
    ? await prisma.employmentHistory.count({ where: { employeeId: { in: testEmployeeIds } } })
    : 0;

  console.log(`   - Break records:              ${breakCount}`);
  console.log(`   - Attendance Session records: ${sessionCount}`);
  console.log(`   - Attendance records:         ${attendanceCount}`);
  console.log(`   - Activity logs:              ${activityLogTargetCount}`);
  console.log(`   - Audit logs (attendance):    ${auditLogTargetCount}`);
  if (!isAttendanceOnly) {
    console.log(`   - Test Employee sessions:     ${loginSessionCount}`);
    console.log(`   - Employment histories:       ${employmentHistoryCount}`);
    console.log(`   - Test Employee profiles:     ${testEmployees.length}`);
  }

  if (isDryRun) {
    console.log("\n=================================================================");
    console.log("✓ DRY-RUN COMPLETED: No changes were committed to the database.");
    console.log("=================================================================\n");
    return;
  }

  // 4. Execute atomic deletion inside a Prisma transaction
  console.log("\n3. Executing targeted deletion transaction...");

  const result = await prisma.$transaction(async (tx) => {
    // A. Delete all breaks
    const deletedBreaks = await tx.break.deleteMany({});

    // B. Delete all attendance sessions
    const deletedSessions = await tx.attendanceSession.deleteMany({});

    // C. Delete all attendance parent containers
    const deletedAttendances = await tx.attendance.deleteMany({});

    // D. Delete attendance & test employee activity logs
    const deletedActivityLogs = isAttendanceOnly
      ? await tx.activityLog.deleteMany({
          where: {
            action: { in: ["PUNCH_IN", "PUNCH_OUT", "BREAK_STARTED", "BREAK_ENDED", "BREAK_AUTO_CLOSED", "ATTENDANCE_AUTO_CLOSED"] },
          },
        })
      : await tx.activityLog.deleteMany({
          where: {
            OR: [
              { employeeId: { in: testEmployeeIds } },
              { action: { in: ["PUNCH_IN", "PUNCH_OUT", "BREAK_STARTED", "BREAK_ENDED", "BREAK_AUTO_CLOSED", "ATTENDANCE_AUTO_CLOSED"] } },
            ],
          },
        });

    // E. Delete attendance audit logs (protecting admin login/security logs)
    const deletedAuditLogs = isAttendanceOnly
      ? await tx.auditLog.deleteMany({
          where: { module: "ATTENDANCE" },
        })
      : await tx.auditLog.deleteMany({
          where: {
            OR: [
              { employeeId: { in: testEmployeeIds } },
              { performedById: { in: testEmployeeIds } },
              { module: "ATTENDANCE" },
            ],
            NOT: {
              employeeId: adminEmployee.id,
              action: { in: ["LOGIN_SUCCESS", "LOGIN_FAILED_PASSWORD", "ADMIN_ACTION"] },
            },
          },
        });

    let deletedLoginSessions = { count: 0 };
    let deletedEmploymentHistory = { count: 0 };
    let deletedLeaves = { count: 0 };
    let deletedODs = { count: 0 };
    let deletedNotifications = { count: 0 };
    let deletedAgentTokens = { count: 0 };
    let deletedAgentDevices = { count: 0 };
    let deletedPayrollRecords = { count: 0 };
    let deletedEmployees = { count: 0 };

    if (!isAttendanceOnly && testEmployeeIds.length > 0) {
      // Clear dependent child records for test employees
      deletedLoginSessions = await tx.loginSession.deleteMany({
        where: { employeeId: { in: testEmployeeIds } },
      });

      deletedEmploymentHistory = await tx.employmentHistory.deleteMany({
        where: { employeeId: { in: testEmployeeIds } },
      });

      deletedLeaves = await tx.leave.deleteMany({
        where: {
          OR: [
            { employeeId: { in: testEmployeeIds } },
            { reviewedBy: { in: testEmployeeIds } },
          ],
        },
      });

      deletedODs = await tx.onDutyRequest.deleteMany({
        where: {
          OR: [
            { employeeId: { in: testEmployeeIds } },
            { approvedById: { in: testEmployeeIds } },
          ],
        },
      });

      deletedNotifications = await tx.notification.deleteMany({
        where: { employeeId: { in: testEmployeeIds } },
      });

      deletedAgentTokens = await tx.agentEnrollmentToken.deleteMany({
        where: { employeeId: { in: testEmployeeIds } },
      });

      deletedAgentDevices = await tx.agentDevice.deleteMany({
        where: { employeeId: { in: testEmployeeIds } },
      });

      deletedPayrollRecords = await tx.payrollRecord.deleteMany({
        where: { employeeId: { in: testEmployeeIds } },
      });

      // Clear self-referential manager relations among test employees
      await tx.employee.updateMany({
        where: { id: { in: testEmployeeIds } },
        data: { managerId: null },
      });

      // Finally, delete the test employees
      deletedEmployees = await tx.employee.deleteMany({
        where: {
          id: { in: testEmployeeIds },
          employeeCode: { not: "ADM001" }, // Double safety check
        },
      });
    }

    return {
      deletedBreaks: deletedBreaks.count,
      deletedSessions: deletedSessions.count,
      deletedAttendances: deletedAttendances.count,
      deletedActivityLogs: deletedActivityLogs.count,
      deletedAuditLogs: deletedAuditLogs.count,
      deletedLoginSessions: deletedLoginSessions.count,
      deletedEmploymentHistory: deletedEmploymentHistory.count,
      deletedLeaves: deletedLeaves.count,
      deletedODs: deletedODs.count,
      deletedNotifications: deletedNotifications.count,
      deletedAgentTokens: deletedAgentTokens.count,
      deletedAgentDevices: deletedAgentDevices.count,
      deletedPayrollRecords: deletedPayrollRecords.count,
      deletedEmployees: deletedEmployees.count,
    };
  }, {
    timeout: 30000,
  });

  console.log("   ✓ Deletion transaction completed successfully.");
  console.log(`     • Breaks removed:              ${result.deletedBreaks}`);
  console.log(`     • Sessions removed:            ${result.deletedSessions}`);
  console.log(`     • Attendances removed:         ${result.deletedAttendances}`);
  console.log(`     • Activity logs cleaned:       ${result.deletedActivityLogs}`);
  console.log(`     • Audit logs cleaned:          ${result.deletedAuditLogs}`);
  if (!isAttendanceOnly) {
    console.log(`     • Test Employees removed:      ${result.deletedEmployees}`);
    console.log(`     • Employee sessions removed:   ${result.deletedLoginSessions}`);
  }

  // 5. Post-cleanup health verification
  console.log("\n4. Verifying database integrity and base configuration...");
  const postAdmin = await prisma.employee.findUnique({
    where: { id: adminEmployee.id },
    include: { role: true, department: true },
  });

  if (!postAdmin) {
    throw new Error("❌ INTEGRITY FAILURE: Admin user is missing after cleanup!");
  }
  console.log(`   ✓ Admin Account Intact: [${postAdmin.employeeCode}] ${postAdmin.fullName} (${postAdmin.email})`);

  const rolesCount = await prisma.role.count();
  const deptCount = await prisma.department.count();
  const breakTypesCount = await prisma.breakType.count();
  const settingsCount = await prisma.systemSetting.count();
  const remainingEmps = await prisma.employee.count();
  const remainingAtt = await prisma.attendance.count();
  const remainingBreaks = await prisma.break.count();

  console.log(`   ✓ Roles preserved:           ${rolesCount}`);
  console.log(`   ✓ Departments preserved:     ${deptCount}`);
  console.log(`   ✓ Break Types preserved:     ${breakTypesCount}`);
  console.log(`   ✓ System Settings preserved: ${settingsCount}`);
  console.log(`   ✓ Total Employees remaining: ${remainingEmps} (Expected: 1 admin)`);
  console.log(`   ✓ Attendance records:        ${remainingAtt} (Clean 0)`);
  console.log(`   ✓ Break records:             ${remainingBreaks} (Clean 0)`);

  console.log("\n=================================================================");
  console.log("🎉 DATABASE CLEANUP COMPLETED SUCCESSFULLY!");
  console.log("   The local database is clean, fresh, and ready for work.");
  console.log("=================================================================\n");
}

if (require.main === module) {
  cleanupTestData()
    .catch((err) => {
      console.error("\n❌ Fatal error during cleanup:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
