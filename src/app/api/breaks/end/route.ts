import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to end a break");
    }

    if (auth.role === "ADMIN") {
      return ApiResponse.forbidden("Administrators cannot take attendance breaks.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const breakData = await AttendanceService.endBreak(
      auth.employee.id,
      ipAddress,
      userAgent
    );

    const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Break ended successfully",
      data: {
        break: breakData,
        attendance: todayState,
      },
    });
  } catch (error: any) {
    if (error.message === "NO_ACTIVE_SESSION") {
      return ApiResponse.badRequest("No active work session found.");
    }
    if (error.message === "NO_ACTIVE_BREAK") {
      return ApiResponse.badRequest("No active break found to end.");
    }
    return ApiResponse.serverError("Error ending break", error);
  }
}
