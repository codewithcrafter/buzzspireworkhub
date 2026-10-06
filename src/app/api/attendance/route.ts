import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/attendance
 * Handles retrieving attendance data:
 * - Employees: fetch today's state or personal attendance history.
 * - Admins / HR / Managers: fetch team/department attendance or individual staff records.
 */
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to view attendance records.");
    }

    const { searchParams } = new URL(req.url);
    const targetEmployeeId = searchParams.get("employeeId");
    const date = searchParams.get("date") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const departmentId = searchParams.get("department") || undefined;

    // RBAC: Non-admin employees can ONLY view their own records
    const isPrivileged = hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"]);
    const effectiveEmployeeId = isPrivileged && targetEmployeeId ? targetEmployeeId : auth.employee.id;

    if (!isPrivileged && targetEmployeeId && targetEmployeeId !== auth.employee.id) {
      return ApiResponse.forbidden("Employees are only permitted to access their own attendance records.");
    }

    // 1. If an admin queries summary stats (no specific employee requested)
    if (isPrivileged && !targetEmployeeId && !startDate && !endDate) {
      const summary = await AttendanceService.getAdminAttendanceSummary(date, { departmentId });
      return NextResponse.json({
        success: true,
        data: { summary },
      });
    }

    // 2. If range filter is provided, return paginated history
    if (startDate || endDate || searchParams.has("page")) {
      const history = await AttendanceService.getEmployeeAttendanceHistory(effectiveEmployeeId, {
        startDate,
        endDate,
        page,
        limit,
      });
      return NextResponse.json({
        success: true,
        data: history,
      });
    }

    // 3. Default: fetch today's / specific date's attendance state for the employee
    const attendanceState = await AttendanceService.getTodayAttendance(effectiveEmployeeId, date);
    return NextResponse.json({
      success: true,
      data: {
        attendance: attendanceState,
      },
    });
  } catch (error: any) {
    logger.error("GET /api/attendance error", error);
    return ApiResponse.serverError("Error retrieving attendance information.", error);
  }
}

/**
 * POST /api/attendance
 * Handles attendance state transitions:
 * - PUNCH_IN (Employee self-service or Admin override)
 * - PUNCH_OUT (Employee self-service or Admin override)
 * - MANUAL_PUNCH_IN (Admin / HR manual entry)
 * - MANUAL_PUNCH_OUT / FORCE_PUNCH_OUT (Admin / HR manual checkout)
 * - RESUME_SHIFT (Admin / HR shift resumption)
 */
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to record attendance.");
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    // Apply Rate Limiting (15 requests/minute per IP)
    const rateCheck = checkRateLimit(`attendance-post-${ipAddress}`, { limit: 15, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.reset);
    }

    const body = await req.json().catch(() => ({}));

    // Backwards-compatible action alias resolution (agent_main.py, worker.ts, extension)
    const rawAction = body.action || body.type || body.event || body.eventType || "PUNCH_IN";
    const actionKey = String(rawAction).toUpperCase().replace(/-/g, "_");
    const action =
      actionKey === "CHECK_IN" || actionKey === "CLOCK_IN"
        ? "PUNCH_IN"
        : actionKey === "CHECK_OUT" || actionKey === "CLOCK_OUT"
        ? "PUNCH_OUT"
        : actionKey;

    logger.info("POST /api/attendance dispatching action", {
      action,
      callerId: auth.employee.id,
      callerRole: auth.role,
      targetEmployeeId: body.employeeId || auth.employee.id,
    });

    switch (action) {
      case "PUNCH_IN": {
        // Business Rule: Administrators cannot participate directly as attendance participants
        if (auth.role === "ADMIN" && (!body.employeeId || body.employeeId === auth.employee.id)) {
          return ApiResponse.forbidden(
            "Administrators are not attendance participants. Use manual adjustments to record staff attendance."
          );
        }

        // If privileged user punches in on behalf of an employee
        if (hasRole(auth.role, ["ADMIN", "HR_MANAGER"]) && body.employeeId && body.employeeId !== auth.employee.id) {
          if (body.date && body.time) {
            const result = await AttendanceService.adminManualPunchIn(
              body.employeeId,
              auth.employee.id,
              body.date,
              body.time,
              body.reason || "Admin punch in adjustment",
              ipAddress,
              userAgent
            );
            return NextResponse.json({
              success: true,
              message: "Manual punch in recorded successfully.",
              data: { session: result },
            });
          }
          // Direct punch in on behalf of employee
          const session = await AttendanceService.punchIn(body.employeeId, ipAddress, userAgent);
          const todayState = await AttendanceService.getTodayAttendance(body.employeeId);
          return NextResponse.json({
            success: true,
            message: "Punch in recorded successfully for employee.",
            data: { session, attendance: todayState },
          });
        }

        // Self-service employee punch in
        const session = await AttendanceService.punchIn(auth.employee.id, ipAddress, userAgent);
        const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

        return NextResponse.json({
          success: true,
          message: "Punched in successfully.",
          data: {
            session,
            attendance: todayState,
          },
        });
      }

      case "PUNCH_OUT": {
        // If privileged user punches out on behalf of an employee
        if (hasRole(auth.role, ["ADMIN", "HR_MANAGER"]) && body.employeeId && body.employeeId !== auth.employee.id) {
          if (body.date && body.time) {
            const result = await AttendanceService.adminManualPunchOut(
              body.employeeId,
              auth.employee.id,
              body.date,
              body.time,
              body.reason || "Admin punch out adjustment",
              !!body.isForce,
              ipAddress,
              userAgent
            );
            return NextResponse.json({
              success: true,
              message: "Manual punch out recorded successfully.",
              data: { attendance: result },
            });
          }
          // Direct punch out on behalf of employee
          const result = await AttendanceService.punchOut(body.employeeId, ipAddress, userAgent);
          const todayState = await AttendanceService.getTodayAttendance(body.employeeId);
          return NextResponse.json({
            success: true,
            message: "Punch out recorded successfully for employee.",
            data: { result, attendance: todayState },
          });
        }

        // Self-service employee punch out
        const result = await AttendanceService.punchOut(auth.employee.id, ipAddress, userAgent);
        const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

        return NextResponse.json({
          success: true,
          message: "Punched out successfully.",
          data: {
            result,
            attendance: todayState,
          },
        });
      }

      case "MANUAL_PUNCH_IN": {
        if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
          return ApiResponse.forbidden("Insufficient permissions: Admin or HR Manager role required for manual adjustments.");
        }

        const { employeeId, date, time, reason } = body;
        if (!employeeId || !date || !time || !reason?.trim()) {
          return ApiResponse.badRequest("Employee ID, date (YYYY-MM-DD), time (HH:MM), and reason are required.");
        }

        const session = await AttendanceService.adminManualPunchIn(
          employeeId,
          auth.employee.id,
          date,
          time,
          reason.trim(),
          ipAddress,
          userAgent
        );

        return NextResponse.json({
          success: true,
          message: "Manual punch in recorded successfully.",
          data: { session },
        });
      }

      case "MANUAL_PUNCH_OUT":
      case "FORCE_PUNCH_OUT": {
        if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
          return ApiResponse.forbidden("Insufficient permissions: Admin or HR Manager role required for manual adjustments.");
        }

        const { employeeId, date, time, reason, isForce } = body;
        if (!employeeId || !date || !time || !reason?.trim()) {
          return ApiResponse.badRequest("Employee ID, date (YYYY-MM-DD), time (HH:MM), and reason are required.");
        }

        const attendance = await AttendanceService.adminManualPunchOut(
          employeeId,
          auth.employee.id,
          date,
          time,
          reason.trim(),
          action === "FORCE_PUNCH_OUT" || !!isForce,
          ipAddress,
          userAgent
        );

        return NextResponse.json({
          success: true,
          message: "Manual punch out recorded successfully.",
          data: { attendance },
        });
      }

      case "RESUME_SHIFT": {
        if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
          return ApiResponse.forbidden("Insufficient permissions: Admin or HR Manager role required to resume shifts.");
        }

        const { attendanceId, reason } = body;
        if (!attendanceId || !reason?.trim()) {
          return ApiResponse.badRequest("Attendance ID and reason are required to resume a shift.");
        }

        const result = await AttendanceService.resumeShift(
          attendanceId,
          auth.employee.id,
          reason.trim(),
          ipAddress,
          userAgent
        );

        return NextResponse.json({
          success: true,
          message: "Shift resumed successfully.",
          data: { attendance: result },
        });
      }

      default:
        return ApiResponse.badRequest(`Unsupported attendance action: ${action}`);
    }
  } catch (error: any) {
    logger.error("POST /api/attendance error", error);

    // Map specific business & domain errors to helpful responses
    switch (error.message) {
      case "ALREADY_PUNCHED_IN":
        return ApiResponse.badRequest("You already have an active work session for today.");
      case "NO_ACTIVE_SESSION":
        return ApiResponse.badRequest("No active work session found to punch out from.");
      case "ACTIVE_BREAK_MUST_END_FIRST":
        return ApiResponse.badRequest("You are currently on an active break. Please end your break before punching out.");
      case "EMPLOYMENT_ENDED":
        return ApiResponse.forbidden("Employment has ended for this account. Attendance recording is disabled.");
      case "EMPLOYEE_NOT_ACTIVE":
        return ApiResponse.forbidden("Account is inactive or suspended. Please contact your administrator.");
      case "BEYOND_LAST_WORKING_DATE":
        return ApiResponse.forbidden("Today's date is beyond the recorded last working date.");
      case "ADMIN_ATTENDANCE_NOT_ALLOWED":
        return ApiResponse.forbidden("Administrators do not participate in attendance tracking.");
      case "ATTENDANCE_ALREADY_ACTIVE":
        return ApiResponse.badRequest("An active attendance shift already exists for this date.");
      case "ATTENDANCE_ALREADY_COMPLETED":
        return ApiResponse.badRequest("Attendance has already been completed for this date.");
      case "NO_PUNCH_IN_FOUND":
        return ApiResponse.notFound("No punch-in record was found for this date.");
      case "PUNCH_OUT_BEFORE_PUNCH_IN":
        return ApiResponse.badRequest("Punch-out time cannot be earlier than punch-in time.");
      case "INVALID_PUNCH_TIME":
        return ApiResponse.badRequest("The specified punch timestamp is invalid.");
      case "FUTURE_TIMESTAMP_NOT_ALLOWED":
        return ApiResponse.badRequest("Cannot record attendance timestamps in the future.");
      case "SHIFT_ALREADY_ACTIVE":
        return ApiResponse.badRequest("Shift is currently active and cannot be resumed.");
      default:
        return ApiResponse.serverError("Error processing attendance request.", error);
    }
  }
}
