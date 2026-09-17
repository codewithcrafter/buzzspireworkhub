import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/admin/attendance
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Insufficient permissions to view administrative attendance stats");
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;
    const departmentId = searchParams.get("department") || undefined;

    const summary = await AttendanceService.getAdminAttendanceSummary(date, {
      departmentId,
    });

    return NextResponse.json({
      success: true,
      data: { summary },
      summary,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving administrative attendance summary", error);
  }
}
