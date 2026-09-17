import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { AuditService } from "@/services/audit.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthSession();
    if (!auth) return ApiResponse.unauthorized("Authentication required");
    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Only Administrators and HR Managers can change employee status");
    }
    const { id } = await params;
    const body = await req.json();
    const status = body.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";
    const allowed = ["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED"];
    if (!allowed.includes(status)) return ApiResponse.badRequest("Invalid status value");
    if (id === auth.employee.id && status !== "ACTIVE") return ApiResponse.badRequest("You cannot deactivate your own account");
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) return ApiResponse.notFound("Employee not found");
    const updated = await prisma.employee.update({
      where: { id },
      data: { status: status as any },
      include: { role: true, department: true }
    });
    const sanitized = EmployeeService.sanitizeEmployee(updated);
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    await AuditService.log({
      employeeId: auth.employee.id,
      action: status === "ACTIVE" ? "EMPLOYEE_ACTIVATED" : "EMPLOYEE_DEACTIVATED",
      module: "EMPLOYEE_MANAGEMENT",
      description: "Employee " + existing.fullName + " status changed to " + status,
      ipAddress,
      metadata: { from: existing.status, to: status },
    });
    return NextResponse.json({ success: true, message: "Status updated", data: { employee: sanitized } });
  } catch (error) {
    return ApiResponse.serverError("Error updating employee status", error);
  }
}