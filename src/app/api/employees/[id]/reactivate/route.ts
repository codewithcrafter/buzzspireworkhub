import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/employees/[id]/reactivate
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can reactivate employee accounts");
    }

    const { id } = await params;

    const activated = await EmployeeService.activateEmployee(id, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Employee account reactivated successfully",
      data: { employee: activated },
      employee: activated,
    });
  } catch (error: any) {
    if (error.message === "EMPLOYEE_NOT_FOUND") {
      return ApiResponse.notFound("Employee not found");
    }
    return ApiResponse.serverError("Error reactivating employee account", error);
  }
}
