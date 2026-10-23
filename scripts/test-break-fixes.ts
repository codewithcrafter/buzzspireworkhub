/**
 * TEST SCRIPT: Verifies all break-tracking fixes
 * Run with: npx tsx scripts/test-break-fixes.ts
 */

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { AttendanceService } from "../src/services/attendance.service";
import { calculateDurationSeconds } from "../src/lib/date";

async function runBreakTests() {
  console.log("=========================================================");
  console.log("  BUZZSPIRE WORKHUB — BREAK-TRACKING FIXES TEST SUITE");
  console.log("=========================================================\n");

  // 1. Find a test non-admin employee (e.g. EMP-102 Priya Patel)
  const employee = await prisma.employee.findFirst({
    where: {
      role: { name: { not: "ADMIN" } },
      status: "ACTIVE",
    },
    include: { role: true },
  });

  if (!employee) {
    throw new Error("No active non-admin employee found to test.");
  }
  console.log(`Using test employee: ${employee.fullName} (${employee.employeeCode})`);

  // Ensure MAX_BREAK_DURATION_MINUTES system setting exists
  await prisma.systemSetting.upsert({
    where: { key: "MAX_BREAK_DURATION_MINUTES" },
    update: { value: "180" },
    create: {
      key: "MAX_BREAK_DURATION_MINUTES",
      value: "180",
      description: "Maximum allowable duration for a single break before auto-closing (3 hours)",
    },
  });
  console.log("✓ SystemSetting MAX_BREAK_DURATION_MINUTES verified (180 mins).\n");

  // Get or create today's open session for this employee
  let todayState = await AttendanceService.getTodayAttendance(employee.id);
  if (!todayState || !todayState.activeSession) {
    console.log("Punching in employee for test session...");
    await AttendanceService.punchIn(employee.id);
    todayState = await AttendanceService.getTodayAttendance(employee.id);
  }
  console.log(`✓ Active work session confirmed: Session ID ${todayState?.activeSession?.id}`);

  // Clean any active breaks left over
  const existingActiveBreaks = await prisma.break.findMany({
    where: {
      attendanceSession: { employeeId: employee.id },
      endTime: null,
    },
  });
  if (existingActiveBreaks.length > 0) {
    console.log(`Cleaning ${existingActiveBreaks.length} pre-existing open breaks...`);
    await AttendanceService.endBreak(employee.id);
  }

  // ── TEST 1: Normal Break Start & End ───────────────────────────────────────────
  console.log("\n▶ TEST 1: Normal Break Start & End");
  const breakType = await prisma.breakType.findFirst({
    where: { name: "Tea / Coffee" },
  });
  if (!breakType) throw new Error("Tea / Coffee break type not found");

  const startedBreak = await AttendanceService.startBreak(
    employee.id,
    breakType.id,
    "Testing Break Fixes"
  );
  console.log(`  ✓ Break started: ID ${startedBreak.id} at ${startedBreak.startTime.toISOString()}`);

  // Verify status is ON_BREAK
  const stateDuringBreak = await AttendanceService.getTodayAttendance(employee.id);
  if (stateDuringBreak?.currentState !== "ON_BREAK" || !stateDuringBreak.activeBreak) {
    throw new Error(`Expected currentState to be ON_BREAK, got ${stateDuringBreak?.currentState}`);
  }
  console.log(`  ✓ Current state confirmed: ${stateDuringBreak.currentState} (activeBreak: ${stateDuringBreak.activeBreak.breakTypeName})`);

  // End the break
  const endedBreak = await AttendanceService.endBreak(employee.id);
  console.log(`  ✓ Break ended: durationSeconds=${endedBreak.durationSeconds}s, totalBreakSeconds=${endedBreak.totalBreakSeconds}s`);

  // Verify status transitioned to WORKING and activeBreak is null
  const stateAfterBreak = await AttendanceService.getTodayAttendance(employee.id);
  if (stateAfterBreak?.currentState !== "WORKING" || stateAfterBreak.activeBreak !== null) {
    throw new Error(`Expected currentState to be WORKING, got ${stateAfterBreak?.currentState}`);
  }
  console.log(`  ✓ Post-break state verified: ${stateAfterBreak.currentState} (activeBreak: null)`);

  // ── TEST 2: Multiple Active Breaks Resilient Cleanup ─────────────────────────
  console.log("\n▶ TEST 2: Multiple Active Breaks Resilient Cleanup");
  // Simulate race-condition creation of 2 open breaks
  const activeSessionId = stateAfterBreak.activeSession!.id;
  const b1 = await prisma.break.create({
    data: {
      attendanceSessionId: activeSessionId,
      breakTypeId: breakType.id,
      purpose: "Simulated Concurrent Break 1",
      startTime: new Date(Date.now() - 60000), // 1 min ago
    },
  });
  const b2 = await prisma.break.create({
    data: {
      attendanceSessionId: activeSessionId,
      breakTypeId: breakType.id,
      purpose: "Simulated Concurrent Break 2",
      startTime: new Date(Date.now() - 30000), // 30s ago
    },
  });
  console.log(`  Created 2 concurrent open breaks: ${b1.id.slice(-6)} and ${b2.id.slice(-6)}`);

  // End break - should close BOTH breaks without throwing or leaving one hanging
  await AttendanceService.endBreak(employee.id);

  const remainingOpen = await prisma.break.count({
    where: {
      attendanceSessionId: activeSessionId,
      endTime: null,
    },
  });
  if (remainingOpen !== 0) {
    throw new Error(`Expected 0 remaining open breaks, found ${remainingOpen}`);
  }
  console.log(`  ✓ All open breaks cleanly terminated. Remaining open: ${remainingOpen}`);

  // ── TEST 3: Auto-Timeout / Max Break Duration Cap ───────────────────────────
  console.log("\n▶ TEST 3: Auto-Timeout / Max Break Duration Cap");
  // Simulate an abandoned break that started 5 hours ago (300 mins ago)
  const fiveHoursAgo = new Date(Date.now() - 5 * 3600 * 1000);
  const staleBreak = await prisma.break.create({
    data: {
      attendanceSessionId: activeSessionId,
      breakTypeId: breakType.id,
      purpose: "Abandoned Stale Break (5 hours ago)",
      startTime: fiveHoursAgo,
    },
  });
  console.log(`  Simulated stale break started at: ${fiveHoursAgo.toISOString()}`);

  // Verify getTodayAttendance clamps the displayed elapsed to maxDuration (180 mins)
  const staleState = await AttendanceService.getTodayAttendance(employee.id);
  console.log(`  Duration reported by getTodayAttendance: ${staleState?.activeBreak?.durationSeconds}s`);
  if ((staleState?.activeBreak?.durationSeconds ?? 0) > 180 * 60) {
    throw new Error(`Expected duration to be capped at 10800s, got ${staleState?.activeBreak?.durationSeconds}`);
  }
  console.log(`  ✓ Active break live duration successfully capped at 180 minutes (10,800s)`);

  // Run autoCloseStaleBreaks
  const autoClosedCount = await AttendanceService.autoCloseStaleBreaks(prisma, employee.id, 180);
  console.log(`  ✓ autoCloseStaleBreaks executed: ${autoClosedCount} break(s) auto-closed`);

  const updatedStaleBreak = await prisma.break.findUnique({
    where: { id: staleBreak.id },
  });
  if (!updatedStaleBreak?.endTime || updatedStaleBreak.durationSeconds !== 180 * 60) {
    throw new Error(`Expected stale break duration to be 10800s, got ${updatedStaleBreak?.durationSeconds}`);
  }
  console.log(`  ✓ Stale break capped and closed in database with duration: ${updatedStaleBreak.durationSeconds}s`);

  // ── TEST 4: Idempotency Verification ───────────────────────────────────────
  console.log("\n▶ TEST 4: Idempotency Verification");
  // Try ending break when no break is active
  try {
    await AttendanceService.endBreak(employee.id);
    console.log("  ⚠️ endBreak succeeded unexpectedly");
  } catch (err: any) {
    if (err.message === "NO_ACTIVE_BREAK") {
      console.log(`  ✓ Properly caught expected error: ${err.message}`);
    } else {
      throw err;
    }
  }

  console.log("\n=========================================================");
  console.log("🎉 ALL BREAK-TRACKING FIXES VERIFIED SUCCESSFULLY!");
  console.log("=========================================================\n");
}

runBreakTests()
  .catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
