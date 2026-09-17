import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ActivityService } from "@/services/activity.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/activity-logs/filter-options
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied");
    }

    const options = await ActivityService.getFilterOptions();

    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving activity log filter options", error);
  }
}
