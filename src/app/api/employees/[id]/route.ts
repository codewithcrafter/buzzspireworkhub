import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { AuditService } from "@/services/audit.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// PATCH /api/employees/[id]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthSession();
    if (!auth) return ApiResponse.unauthorized("Authentication required");
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Only Administrators and HR Managers can edit employees");
    }
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) return ApiResponse.notFound("Employee not found");
    const updated = await EmployeeService.updateEmployee(
      id,
      {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone ?? null,
        designation: body.designation ?? null,
        roleId: body.roleId,
        departmentId: body.departmentId ?? null,
        shiftStart: body.shiftStart ?? null,
        shiftEnd: body.shiftEnd ?? null,
        monthlySalary: body.monthlySalary ?? null,
      },
      auth.employee.id
    );
    return NextResponse.json({ success: true, data: { employee: updated } });
  } catch (error: any) {
    if (error.message === "EMPLOYEE_EMAIL_EXISTS") return ApiResponse.badRequest("Email already in use");
    return ApiResponse.serverError("Error updating employee", error);
  }
}

// DELETE /api/employees/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthSession();
    if (!auth) return ApiResponse.unauthorized("Authentication required");
    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden("Only Administrators can permanently delete employees");
    }
    const { id } = await params;
    if (id === auth.employee.id) return ApiResponse.badRequest("You cannot delete your own account");
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) return ApiResponse.notFound("Employee not found");
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    // Cascade: Attendance, Leave, LoginSession, Notification deleted automatically
    // AuditLog, ActivityLog: SetNull — history preserved
    await prisma.employee.delete({ where: { id } });
    await AuditService.log({
      employeeId: auth.employee.id,
      action: "EMPLOYEE_DELETED",
      module: "EMPLOYEE_MANAGEMENT",
      description: "Employee " + existing.fullName + " (" + existing.employeeCode + ") permanently deleted",
      ipAddress,
      metadata: { deletedId: existing.employeeId, deletedCode: existing.employeeCode, deletedEmail: existing.email },
    });
    return NextResponse.json({ success: true, message: "Employee permanently deleted" });
  } catch (error: any) {
    if (error?.code === "P2003" || error?.code === "P2014") {
      return NextResponse.json(
        { success: false, message: "Cannot delete — historical records exist. Please Deactivate the account instead.", code: "DELETE_BLOCKED" },
        { status: 409 }
      );
    }
    return ApiResponse.serverError("Error deleting employee", error);
  }
}