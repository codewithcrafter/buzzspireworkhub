import { NextResponse } from "next/server";
import { EmployeeLifecycleService } from "@/services/employee-lifecycle.service";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { ROLE_PERMISSIONS } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAuthToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const permissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    if (!permissions.includes("EMPLOYEE_LIFECYCLE_MANAGE")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { action, payload } = body;

    let updatedEmployee;

    switch (action) {
      case "START_PROBATION":
        updatedEmployee = await EmployeeLifecycleService.startProbation(
          id,
          new Date(payload.probationStart),
          payload.probationEnd ? new Date(payload.probationEnd) : undefined,
          user.sub
        );
        break;

      case "CONFIRM":
        updatedEmployee = await EmployeeLifecycleService.confirmEmployee(
          id,
          new Date(payload.confirmationDate),
          user.sub
        );
        break;

      case "RESIGN":
        updatedEmployee = await EmployeeLifecycleService.recordResignation(
          id,
          new Date(payload.resignationDate),
          new Date(payload.noticePeriodStart),
          new Date(payload.lastWorkingDate),
          payload.reason,
          user.sub
        );
        break;

      case "TERMINATE":
        updatedEmployee = await EmployeeLifecycleService.terminateEmployee(
          id,
          new Date(payload.exitDate),
          payload.reason,
          user.sub
        );
        break;

      case "EXIT":
        updatedEmployee = await EmployeeLifecycleService.exitEmployee(
          id,
          new Date(payload.exitDate),
          user.sub
        );
        break;

      default:
        return NextResponse.json({ success: false, error: "Invalid lifecycle action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      employee: EmployeeService.sanitizeEmployee(updatedEmployee),
    });
  } catch (error: any) {
    console.error("Employee Lifecycle API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process lifecycle action" },
      { status: error.message.includes("NOT_FOUND") ? 404 : 400 }
    );
  }
}
