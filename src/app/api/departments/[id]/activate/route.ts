import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { DepartmentService } from "@/services/department.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/departments/[id]/activate
export async function POST(_req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators and HR Managers can activate departments"
      );
    }

    const { id } = await params;
    const department = await DepartmentService.activateDepartment(id, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Department activated successfully",
      data: { department },
    });
  } catch (error: any) {
    if (error.message === "DEPARTMENT_NOT_FOUND") {
      return ApiResponse.notFound("Department not found");
    }
    return ApiResponse.serverError("Error activating department", error);
  }
}
