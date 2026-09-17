import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/employees
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // Role check: ADMIN, HR_MANAGER, MANAGER can list employees
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Insufficient permissions to view employee directory");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const departmentCode = searchParams.get("department") || undefined;
    const roleName = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await EmployeeService.getEmployees({
      search,
      departmentCode,
      roleName,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
      employees: result.employees,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error fetching employee roster", error);
  }
}

/** Generate a random alphanumeric password of given length */
function generateInitialPassword(length = 10): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/employees
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // Role check: ADMIN or HR_MANAGER can create employees
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can create employee accounts");
    }

    const body = await req.json();

    const fullName = (body.fullName || body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();

    if (!fullName || !email) {
      return ApiResponse.badRequest("Full name and email are required");
    }

    // Resolve roleId: accept either a real UUID or a role name string (e.g. "EMPLOYEE", "ADMIN")
    let roleId = (body.roleId || "").toString().trim();
    const roleNameInput = (body.roleName || body.role || "").toString().trim().toUpperCase();

    // If roleId looks like a name (not a UUID) or is missing, resolve from DB by name
    const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleId);
    if (!looksLikeUuid) {
      const nameToLookup = roleNameInput || roleId.toUpperCase();
      if (!nameToLookup) {
        return ApiResponse.badRequest("Role is required");
      }
      const roleRecord = await prisma.role.findFirst({ where: { name: nameToLookup as any } });
      if (!roleRecord) {
        return ApiResponse.badRequest(`Role "${nameToLookup}" not found. Valid roles: ADMIN, MANAGER, HR_MANAGER, EMPLOYEE`);
      }
      roleId = roleRecord.id;
    }

    // Resolve departmentId: accept either a UUID or a department name/code
    let departmentId: string | undefined = body.departmentId ? body.departmentId.toString().trim() : undefined;
    const deptNameInput = (body.departmentName || body.department || "").toString().trim();

    if (deptNameInput && (!departmentId || !/^[0-9a-f]{8}-/.test(departmentId))) {
      const deptRecord = await prisma.department.findFirst({
        where: {
          OR: [
            { name: { contains: deptNameInput, mode: "insensitive" } },
            { code: deptNameInput.toUpperCase() },
          ],
        },
      });
      if (deptRecord) departmentId = deptRecord.id;
    }

    // Use provided password, or generate a secure random one
    const plainPassword = (body.password || "").toString().trim();
    const isGenerated = !plainPassword;
    const initialPassword = isGenerated ? generateInitialPassword() : plainPassword;

    const newEmployee = await EmployeeService.createEmployee(
      {
        fullName,
        email,
        password: initialPassword,
        roleId,
        departmentId,
        employeeId: body.employeeCode, // Treat custom login ID as primary employee ID
        employeeCode: body.employeeCode,
        phone: body.phone,
        designation: body.designation,
        joiningDate: body.joiningDate,
        shiftStart: body.shiftStart,
        shiftEnd: body.shiftEnd,
        hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : undefined,
        monthlySalary: body.monthlySalary || body.salary ? parseFloat(body.monthlySalary || body.salary) : undefined,
        status: body.status || "ACTIVE",
      },
      auth.employee.id
    );

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        data: {
          employee: newEmployee,
          // Initial password returned ONCE — stored hashed in DB, never retrievable again
          ...(isGenerated && newEmployee && { initialPassword, loginId: newEmployee.employeeCode }),
        },
        employee: newEmployee,
        ...(isGenerated && newEmployee && { initialPassword, loginId: newEmployee.employeeCode }),
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "EMPLOYEE_EMAIL_EXISTS") {
      return ApiResponse.badRequest("An account with this email address already exists");
    }
    if (error.message === "EMPLOYEE_ID_EXISTS") {
      return ApiResponse.badRequest("The specified Employee ID is already assigned");
    }
    if (error.message === "ROLE_NOT_FOUND") {
      return ApiResponse.badRequest("Selected role is invalid or does not exist");
    }
    if (error.message === "DEPARTMENT_NOT_FOUND") {
      return ApiResponse.badRequest("Selected department is invalid or does not exist");
    }
    return ApiResponse.serverError("Error creating employee account", error);
  }
}

