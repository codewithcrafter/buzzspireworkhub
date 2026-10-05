import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // attendanceId (may be 'new')
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (auth.role !== "ADMIN") {
      return ApiResponse.forbidden("Only administrators can perform manual punch in.");
    }

    const body = await req.json().catch(() => ({}));
    const { employeeId, date, time, reason } = body;

    if (!employeeId) {
      return ApiResponse.badRequest("Employee ID is required in the body.");
    }

    if (!date || !time || !reason || typeof reason !== "string" || !reason.trim()) {
      return ApiResponse.badRequest("Date, time, and reason are required.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await AttendanceService.adminManualPunchIn(
      employeeId,
      auth.employee?.id || "admin",
      date,
      time,
      reason.trim(),
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: "Manual punch in successful.",
      data: { session: result },
    });
  } catch (error: any) {
    console.error("Manual Punch In Error:", error);
    
    if (error.message === "EMPLOYEE_NOT_FOUND") return ApiResponse.notFound("Employee not found.");
    if (error.message === "ADMIN_ATTENDANCE_NOT_ALLOWED") return ApiResponse.badRequest("Admin attendance is not allowed.");
    if (error.message === "ATTENDANCE_ALREADY_ACTIVE") return ApiResponse.badRequest("Shift is already active for this employee.");
    if (error.message === "ATTENDANCE_ALREADY_COMPLETED") return ApiResponse.badRequest("Attendance already completed for this day. Cannot manual punch in.");
    if (error.message === "INVALID_PUNCH_TIME") return ApiResponse.badRequest("Invalid punch time.");
    if (error.message === "FUTURE_TIMESTAMP_NOT_ALLOWED") return ApiResponse.badRequest("Future timestamp not allowed.");

    return ApiResponse.serverError("Error performing manual punch in", error);
  }
}
