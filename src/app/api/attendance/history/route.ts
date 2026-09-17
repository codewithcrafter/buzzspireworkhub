import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/attendance/history
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await AttendanceService.getEmployeeAttendanceHistory(
      auth.employee.id,
      {
        startDate,
        endDate,
        status,
        page,
        limit,
      }
    );

    return NextResponse.json({
      success: true,
      data: result,
      history: result.history,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving attendance history", error);
  }
}
