import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/reports/headcount
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators and HR Managers can view headcount reports"
      );
    }

    const result = await ReportService.getHeadcountReport();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return ApiResponse.serverError("Error generating headcount report", error);
  }
}
