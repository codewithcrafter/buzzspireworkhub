import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/reports/dashboard-summary
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // All authenticated employees can view the dashboard summary
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER", "EMPLOYEE"])) {
      return ApiResponse.forbidden("Access denied");
    }

    const result = await ReportService.getDashboardSummary();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving dashboard summary", error);
  }
}
