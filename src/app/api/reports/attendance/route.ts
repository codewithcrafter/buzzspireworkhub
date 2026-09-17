import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/reports/attendance
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);

    // Date range — defaults to current month
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : defaultStart;
    const endDate = rawEnd ? new Date(rawEnd) : defaultEnd;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return ApiResponse.badRequest("Invalid date range provided");
    }

    if (startDate > endDate) {
      return ApiResponse.badRequest("startDate must be before endDate");
    }

    let scopedEmployeeId = searchParams.get("employeeId") || undefined;
    let scopedDepartmentId = searchParams.get("departmentId") || undefined;

    if (auth.role === "EMPLOYEE") {
      // Employees can only see their own attendance
      scopedEmployeeId = auth.employee.id;
      scopedDepartmentId = undefined;
    } else if (auth.role === "MANAGER") {
      // Managers can only see their own department
      if (auth.employee.departmentId) {
        scopedDepartmentId = auth.employee.departmentId;
      }
    }

    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await ReportService.getAttendanceReport({
      startDate,
      endDate,
      employeeId: scopedEmployeeId,
      departmentId: scopedDepartmentId,
      status,
      page,
      limit,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return ApiResponse.serverError("Error generating attendance report", error);
  }
}
