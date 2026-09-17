import { NextResponse } from "next/server";
import { getAuthSession, hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/api-response";
import {
  getStartOfDay,
  getEndOfDay,
  calculateDurationSeconds,
} from "@/lib/date";

/**
 * GET /api/attendance/live
 *
 * Returns a real-time attendance snapshot for all currently active employees.
 *
 * Access:
 *   - ADMIN / HR_MANAGER : full org snapshot
 *   - MANAGER            : own department only (team scope)
 *   - EMPLOYEE           : 401 Forbidden
 */
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { role, employee } = auth;

    // Only ADMIN / HR_MANAGER / MANAGER may see live attendance
    const canSeeAll = hasPermission(role, "ATTENDANCE_READ_ALL");
    const canSeeTeam = hasPermission(role, "ATTENDANCE_READ_TEAM");

    if (!canSeeAll && !canSeeTeam) {
      return ApiResponse.forbidden(
        "Access denied: ATTENDANCE_READ_ALL or ATTENDANCE_READ_TEAM required"
      );
    }

    const now = new Date();
    const startOfDay = getStartOfDay(now);
    const endOfDay = getEndOfDay(now);

    // Build employee filter based on scope
    const employeeWhere: Record<string, unknown> = { status: "ACTIVE" };
    if (!canSeeAll && canSeeTeam && employee.departmentId) {
      // MANAGER: restrict to own department
      employeeWhere.departmentId = employee.departmentId;
    }

    // Fetch all active employees with today's attendance in one query
    const employees = await prisma.employee.findMany({
      where: employeeWhere,
      select: {
        id: true,
        employeeId: true,
        employeeCode: true,
        fullName: true,
        designation: true,
        shiftStart: true,
        shiftEnd: true,
        department: { select: { id: true, name: true } },
        role: { select: { name: true } },
        attendances: {
          where: { date: { gte: startOfDay, lte: endOfDay } },
          take: 1,
          include: {
            sessions: {
              orderBy: { createdAt: "asc" },
              include: {
                breaks: {
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { fullName: "asc" },
    });

    const liveStates = employees.map((emp) => {
      const attendance = emp.attendances[0] ?? null;

      if (!attendance) {
        return {
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          fullName: emp.fullName,
          designation: emp.designation ?? null,
          department: emp.department?.name ?? null,
          role: emp.role.name,
          currentState: "ABSENT" as const,
          punchIn: null,
          punchOut: null,
          liveWorkingSeconds: 0,
          liveBreakSeconds: 0,
          netWorkingSeconds: 0,
          isLate: false,
          lateMinutes: 0,
          currentBreakDuration: 0,
          shiftStart: emp.shiftStart ?? null,
          shiftEnd: emp.shiftEnd ?? null,
        };
      }

      const activeSession = attendance.sessions.find((s) => !s.punchOut);
      const activeBreak = activeSession?.breaks.find((b) => !b.endTime);

      // Live working seconds calculation
      let liveWorkingSeconds = attendance.totalWorkingSeconds;
      if (activeSession) {
        const closedSeconds = attendance.sessions
          .filter((s) => s.punchOut)
          .reduce((sum, s) => sum + (s.workingSeconds ?? 0), 0);
        liveWorkingSeconds =
          closedSeconds + calculateDurationSeconds(activeSession.punchIn, now);
      }

      // Live break seconds calculation
      let liveBreakSeconds = attendance.totalBreakSeconds;
      let currentBreakDuration = 0;
      if (activeBreak) {
        currentBreakDuration = calculateDurationSeconds(
          activeBreak.startTime,
          now
        );
        const closedBreaks = attendance.sessions
          .flatMap((s) => s.breaks)
          .filter((b) => b.endTime)
          .reduce((sum, b) => sum + (b.durationSeconds ?? 0), 0);
        liveBreakSeconds = closedBreaks + currentBreakDuration;
      }

      const netWorkingSeconds = Math.max(
        0,
        liveWorkingSeconds - liveBreakSeconds
      );

      // Determine current state
      let currentState: "WORKING" | "ON_BREAK" | "COMPLETED" | "ABSENT";
      if (activeBreak) {
        currentState = "ON_BREAK";
      } else if (activeSession) {
        currentState = "WORKING";
      } else if (attendance.sessions.length > 0) {
        currentState = "COMPLETED";
      } else {
        currentState = "ABSENT";
      }

      // First punch-in across all sessions
      const firstSession = attendance.sessions[0] ?? null;
      const lastSession =
        attendance.sessions[attendance.sessions.length - 1] ?? null;

      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        designation: emp.designation ?? null,
        department: emp.department?.name ?? null,
        role: emp.role.name,
        currentState,
        punchIn: firstSession?.punchIn ?? null,
        punchOut: lastSession?.punchOut ?? null,
        liveWorkingSeconds,
        liveBreakSeconds,
        netWorkingSeconds,
        currentBreakDuration,
        isLate: attendance.isLate,
        lateMinutes: attendance.lateMinutes,
        shiftStart: emp.shiftStart ?? null,
        shiftEnd: emp.shiftEnd ?? null,
      };
    });

    // Summary counts
    const summary = {
      totalEmployees: liveStates.length,
      present: liveStates.filter((s) => s.currentState !== "ABSENT").length,
      absent: liveStates.filter((s) => s.currentState === "ABSENT").length,
      working: liveStates.filter((s) => s.currentState === "WORKING").length,
      onBreak: liveStates.filter((s) => s.currentState === "ON_BREAK").length,
      completed: liveStates.filter((s) => s.currentState === "COMPLETED")
        .length,
      late: liveStates.filter((s) => s.isLate).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        liveStates,
        summary,
        generatedAt: now.toISOString(),
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error fetching live attendance", error);
  }
}
