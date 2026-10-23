import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

/**
 * PATCH /api/admin/attendance/break
 * Allows administrators and HR managers to force-end an active break session for an employee.
 */
export async function PATCH(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to manage employee breaks.");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Admin or HR Manager role required to force-end breaks.");
    }

    const body = await req.json().catch(() => ({}));
    const { employeeId, breakId, reason, time } = body;

    if (!employeeId) {
      return ApiResponse.badRequest("Target employee ID is required.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    let customEndTime: Date | undefined;
    if (time) {
      const parsedTime = new Date(time);
      if (!isNaN(parsedTime.getTime())) {
        customEndTime = parsedTime;
      }
    }

    const result = await AttendanceService.adminForceEndBreak({
      employeeId,
      adminId: auth.employee?.id || "admin",
      breakId,
      endTime: customEndTime,
      reason: reason?.trim() || "Force-ended by Administrator from dashboard",
      ipAddress,
      userAgent,
    });

    const todayState = await AttendanceService.getTodayAttendance(employeeId);

    return NextResponse.json({
      success: true,
      message: `Active break successfully terminated (${result.closedCount} break(s) closed).`,
      data: {
        result,
        attendance: todayState,
      },
    });
  } catch (error: any) {
    console.error("Admin Force End Break Error:", error);

    if (error.message === "NO_ACTIVE_BREAK") {
      return ApiResponse.badRequest("No active running break found for this employee.");
    }
    if (error.message === "EMPLOYEE_NOT_FOUND") {
      return ApiResponse.notFound("Employee record could not be found.");
    }

    return ApiResponse.serverError("Error force-ending employee break", error);
  }
}

// POST alias for PATCH for client compatibility
export async function POST(req: Request) {
  return PATCH(req);
}
