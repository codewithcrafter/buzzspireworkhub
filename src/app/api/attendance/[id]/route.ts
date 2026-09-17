import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/attendance/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;

    const attendance = await AttendanceService.getAttendanceById(
      id,
      auth.employee.id,
      auth.role,
      auth.employee.departmentId
    );

    return NextResponse.json({
      success: true,
      data: { attendance },
      attendance,
    });
  } catch (error: any) {
    if (error.message === "ATTENDANCE_NOT_FOUND") {
      return ApiResponse.notFound("Attendance record not found");
    }
    if (error.message === "FORBIDDEN") {
      return ApiResponse.forbidden("Access denied: You are not authorized to view this attendance record");
    }
    return ApiResponse.serverError("Error retrieving attendance details", error);
  }
}
