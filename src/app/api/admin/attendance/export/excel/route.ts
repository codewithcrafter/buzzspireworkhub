import { NextResponse } from "next/server";
import { getAuthSession, hasRole, hasPermission } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/attendance/export/excel
 * Exports comprehensive date range attendance records for all active employees to Excel (.xlsx).
 * Query parameters:
 *   - from: YYYY-MM-DD (start date, inclusive)
 *   - to: YYYY-MM-DD (end date, inclusive)
 *   - department / departmentId: (optional department ID filter)
 */
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to export attendance records.");
    }

    // Role check: Only authorized ADMIN/HR roles with appropriate attendance export permission
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"]) || !hasPermission(auth.role, "EXPORT_ATTENDANCE")) {
      return ApiResponse.forbidden("Access denied: Administrative permissions required to export attendance records.");
    }

    const { searchParams } = new URL(req.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const departmentParam = searchParams.get("department") || searchParams.get("departmentId") || undefined;

    // Validate presence
    if (!fromParam || !toParam) {
      return ApiResponse.badRequest("Both 'from' and 'to' date query parameters are required in YYYY-MM-DD format.");
    }

    // Validate format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromParam) || !dateRegex.test(toParam)) {
      return ApiResponse.badRequest("Invalid date format. Expected YYYY-MM-DD (e.g. 2026-10-01).");
    }

    const fromDate = new Date(`${fromParam}T00:00:00Z`);
    const toDate = new Date(`${toParam}T00:00:00Z`);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return ApiResponse.badRequest("Invalid calendar dates provided.");
    }

    if (fromParam > toParam) {
      return ApiResponse.badRequest("From Date cannot be later than To Date.");
    }

    // Validate range span: prevent excessively large queries (maximum 93 days / ~3 months)
    const diffDays = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
    if (diffDays > 93) {
      return ApiResponse.badRequest("Date range cannot exceed 93 days (~3 months). Please select a narrower range.");
    }

    const { buffer, filename } = await AttendanceService.generateDateRangeExcelReport({
      fromDate: fromParam,
      toDate: toParam,
      departmentId: departmentParam,
    });

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("Attendance Excel Export Route Error:", error);
    return ApiResponse.serverError("Error generating attendance Excel export", error);
  }
}
