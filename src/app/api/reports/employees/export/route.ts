import { NextResponse } from "next/server";
import { getAuthSession, hasPermission } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv } from "@/lib/export-utils";

// GET /api/reports/employees/export
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    if (!hasPermission(auth.role, "EXPORT_EMPLOYEE")) {
      return ApiResponse.forbidden("Access denied: Permission EXPORT_EMPLOYEE required", req);
    }

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await EmployeeService.getEmployees({
      departmentId: auth.role === "MANAGER" ? auth.employee.departmentId ?? undefined : departmentId,
      status,
      limit: 200,
    });

    const headers = [
      { key: "employeeId" as const, label: "Employee Code" },
      { key: "fullName" as const, label: "Full Name" },
      { key: "email" as const, label: "Email" },
      { key: "phone" as const, label: "Phone" },
      { key: "department" as const, label: "Department" },
      { key: "designation" as const, label: "Designation" },
      { key: "role" as const, label: "Role" },
      { key: "status" as const, label: "Status" },
      { key: "joiningDate" as const, label: "Joining Date" },
    ];

    const formattedRows = result.employees
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .map((e) => ({
        employeeId: e.employeeId,
        fullName: e.fullName,
        email: e.email,
        phone: e.phone || "N/A",
        department: e.department || "Unassigned",
        designation: e.designation || "N/A",
        role: e.role,
        status: e.status,
        joiningDate: e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : "N/A",
      }));

    const csvData = generateCsv(formattedRows, headers);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="employees-export-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error exporting employees data", error, req);
  }
}
