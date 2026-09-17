import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to punch out");
    }

    if (auth.role === "ADMIN") {
      return ApiResponse.forbidden("Administrators are not attendance participants.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await AttendanceService.punchOut(auth.employee.id, ipAddress, userAgent);
    const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Punched out successfully",
      data: {
        result,
        attendance: todayState,
      },
    });
  } catch (error: any) {
    if (error.message === "NO_ACTIVE_SESSION") {
      return ApiResponse.badRequest("No active work session found to punch out from.");
    }
    if (error.message === "ACTIVE_BREAK_MUST_END_FIRST") {
      return ApiResponse.badRequest("You are currently on a break. Please end your break before punching out.");
    }
    return ApiResponse.serverError("Error processing punch out", error);
  }
}
