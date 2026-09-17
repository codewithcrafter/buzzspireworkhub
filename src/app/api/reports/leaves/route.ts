import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/reports/leaves
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators, HR Managers, and Managers can view leave reports"
      );
    }

    const { searchParams } = new URL(req.url);

    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), 0, 1); // Jan 1 of current year
    const defaultEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : defaultStart;
    const endDate = rawEnd ? new Date(rawEnd) : defaultEnd;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return ApiResponse.badRequest("Invalid date range provided");
    }

    const employeeId = searchParams.get("employeeId") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const status = searchParams.get("status") || undefined;
    const leaveType = searchParams.get("leaveType") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await ReportService.getLeaveReport({
      startDate,
      endDate,
      employeeId,
      departmentId,
      status,
      leaveType,
      page,
      limit,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return ApiResponse.serverError("Error generating leave report", error);
  }
}
