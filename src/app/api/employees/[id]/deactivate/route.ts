import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/employees/[id]/deactivate
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can deactivate employee accounts");
    }

    const { id } = await params;

    // Prevent self-deactivation
    if (auth.employee.id === id) {
      return ApiResponse.badRequest("You cannot deactivate your own active session account");
    }

    const deactivated = await EmployeeService.deactivateEmployee(id, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Employee account deactivated successfully",
      data: { employee: deactivated },
      employee: deactivated,
    });
  } catch (error: any) {
    if (error.message === "EMPLOYEE_NOT_FOUND") {
      return ApiResponse.notFound("Employee not found");
    }
    return ApiResponse.serverError("Error deactivating employee account", error);
  }
}
