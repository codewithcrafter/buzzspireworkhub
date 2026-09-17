import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/admin/live-attendance
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Insufficient permissions to view live attendance monitor");
    }

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("department") || undefined;
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;

    const liveStates = await AttendanceService.getLiveAttendanceStates({
      departmentId,
      status,
      date,
    });

    return NextResponse.json({
      success: true,
      data: {
        liveStates,
        count: liveStates.length,
      },
      liveStates,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving live attendance status", error);
  }
}
