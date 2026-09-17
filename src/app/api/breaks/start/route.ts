import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to start a break");
    }

    if (auth.role === "ADMIN") {
      return ApiResponse.forbidden("Administrators cannot take attendance breaks.");
    }

    const body = await req.json().catch(() => ({}));
    const breakTypeId = (body.breakTypeId || "").toString().trim();
    const purpose = body.purpose ? body.purpose.toString().trim() : undefined;
    const overrideStartTime = body.overrideStartTime;
    const isIdleFallback = Boolean(body.isIdleFallback);

    if (!breakTypeId && !isIdleFallback) {
      return ApiResponse.badRequest("Break type ID is required");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const breakData = await AttendanceService.startBreak(
      auth.employee.id,
      breakTypeId,
      purpose,
      ipAddress,
      userAgent,
      overrideStartTime,
      isIdleFallback
    );

    const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Break started successfully",
      data: {
        break: breakData,
        attendance: todayState,
      },
    });
  } catch (error: any) {
    if (error.message === "NO_ACTIVE_SESSION") {
      return ApiResponse.badRequest("You must punch in before starting a break.");
    }
    if (error.message === "BREAK_ALREADY_ACTIVE") {
      return ApiResponse.badRequest("You are already on an active break. Resume work before taking another break.");
    }
    if (error.message === "BREAK_TYPE_NOT_FOUND") {
      return ApiResponse.badRequest("The selected break type is invalid.");
    }
    if (error.message === "PURPOSE_REQUIRED_FOR_OTHER_BREAK") {
      return ApiResponse.badRequest("Please specify the purpose for your break.");
    }
    return ApiResponse.serverError("Error starting break", error);
  }
}
