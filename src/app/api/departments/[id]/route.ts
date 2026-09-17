import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { DepartmentService } from "@/services/department.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/departments/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const department = await DepartmentService.getDepartmentById(id);

    return NextResponse.json({
      success: true,
      data: { department },
      department,
    });
  } catch (error: any) {
    if (error.message === "DEPARTMENT_NOT_FOUND") {
      return ApiResponse.notFound("Department not found");
    }
    return ApiResponse.serverError("Error fetching department details", error);
  }
}

// PATCH /api/departments/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can update departments");
    }

    const { id } = await params;
    const body = await req.json();

    const updatedDepartment = await DepartmentService.updateDepartment(id, body, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Department updated successfully",
      data: { department: updatedDepartment },
    });
  } catch (error: any) {
    if (error.message === "DEPARTMENT_NOT_FOUND") {
      return ApiResponse.notFound("Department not found");
    }
    return ApiResponse.serverError("Error updating department", error);
  }
}

// DELETE /api/departments/[id] (Soft Deactivate)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can deactivate departments");
    }

    const { id } = await params;
    const deactivatedDepartment = await DepartmentService.deactivateDepartment(id, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Department deactivated successfully",
      data: { department: deactivatedDepartment },
    });
  } catch (error: any) {
    if (error.message === "DEPARTMENT_NOT_FOUND") {
      return ApiResponse.notFound("Department not found");
    }
    if (error.message === "DEPARTMENT_HAS_EMPLOYEES") {
      return ApiResponse.badRequest("Cannot deactivate department while active employees are assigned. Please reassign active employees first.");
    }
    return ApiResponse.serverError("Error deactivating department", error);
  }
}
