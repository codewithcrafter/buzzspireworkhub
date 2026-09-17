import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { ProductivityService } from "@/services/productivity.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/reports/productivity
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    const { searchParams } = new URL(req.url);

    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : defaultStart;
    const endDate = rawEnd ? new Date(rawEnd) : defaultEnd;

    let employeeId = searchParams.get("employeeId") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;

    // Authorization scoping
    if (auth.role === "EMPLOYEE") {
      employeeId = auth.employee.id;
    } else if (auth.role === "MANAGER") {
      if (!auth.employee.departmentId) {
        return ApiResponse.forbidden("Manager has no assigned department", req);
      }
    }

    const productivity = await ProductivityService.getProductivityMetrics({
      startDate,
      endDate,
      employeeId,
      departmentId: auth.role === "MANAGER" ? auth.employee.departmentId ?? undefined : departmentId,
    });

    return NextResponse.json({ success: true, data: productivity });
  } catch (error) {
    return ApiResponse.serverError("Error fetching productivity metrics", error, req);
  }
}
