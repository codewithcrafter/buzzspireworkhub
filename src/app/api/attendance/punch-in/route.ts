import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to punch in");
    }

    if (auth.role === "ADMIN") {
      return ApiResponse.forbidden("Administrators are not attendance participants.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    
    // Apply Rate Limiting (10 requests per minute per IP for punch-ins to prevent spam)
    const rateCheck = checkRateLimit(`punch-in-${ipAddress}`, { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.reset);
    }

    const userAgent = req.headers.get("user-agent") || undefined;

    const session = await AttendanceService.punchIn(auth.employee.id, ipAddress, userAgent);
    const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Punched in successfully",
      data: {
        session,
        attendance: todayState,
      },
    });
  } catch (error: any) {
    if (error.message === "ALREADY_PUNCHED_IN") {
      return ApiResponse.badRequest("You already have an active work session. Please punch out before starting a new session.");
    }
    if (error.message === "EMPLOYEE_NOT_ACTIVE") {
      return ApiResponse.forbidden("Inactive accounts are not allowed to record attendance.");
    }
    return ApiResponse.serverError("Error processing punch in", error);
  }
}
