import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { DepartmentService } from "@/services/department.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/departments
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await DepartmentService.getDepartments({ search, status, page, limit });

    return NextResponse.json({
      success: true,
      data: result,
      departments: result.departments,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving departments", error);
  }
}

// POST /api/departments
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // Role restriction: ADMIN or HR_MANAGER can create departments
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can create departments");
    }

    const body = await req.json();
    const code = (body.code || "").toString().trim();
    const name = (body.name || "").toString().trim();

    if (!code || !name) {
      return ApiResponse.badRequest("Department code and name are required");
    }

    const newDepartment = await DepartmentService.createDepartment(
      {
        code,
        name,
        manager: body.manager,
        status: body.status || "ACTIVE",
      },
      auth.employee.id
    );

    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully",
        data: { department: newDepartment },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "DUPLICATE_DEPARTMENT") {
      return ApiResponse.badRequest("A department with this code or name already exists");
    }
    return ApiResponse.serverError("Error creating department", error);
  }
}
