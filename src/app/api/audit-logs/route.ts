import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AuditService } from "@/services/audit.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/audit-logs
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // Only ADMIN can read audit logs (immutable security audit trail)
    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators can view security audit logs"
      );
    }

    const { searchParams } = new URL(req.url);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : undefined;
    const endDate = rawEnd ? new Date(rawEnd) : undefined;

    if (startDate && isNaN(startDate.getTime())) {
      return ApiResponse.badRequest("Invalid startDate");
    }
    if (endDate && isNaN(endDate.getTime())) {
      return ApiResponse.badRequest("Invalid endDate");
    }

    const employeeId = searchParams.get("employeeId") || undefined;
    const action = searchParams.get("action") || undefined;
    const module = searchParams.get("module") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await AuditService.getLogs({
      employeeId,
      action,
      module,
      startDate,
      endDate,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
      logs: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving audit logs", error);
  }
}
