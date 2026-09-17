import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AuditService } from "@/services/audit.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/audit-logs/filter-options
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators can view security audit logs");
    }

    const options = await AuditService.getFilterOptions();

    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving audit log filter options", error);
  }
}
