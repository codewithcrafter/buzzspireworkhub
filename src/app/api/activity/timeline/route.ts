import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { TimelineService } from "@/services/timeline.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to view timeline");
    }

    const { searchParams } = new URL(req.url);
    const targetEmployeeId = searchParams.get("employeeId");
    const targetDateStr = searchParams.get("date");

    if (!targetEmployeeId) {
      return ApiResponse.badRequest("employeeId parameter is required");
    }

    const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
    if (isNaN(targetDate.getTime())) {
      return ApiResponse.badRequest("Invalid date format");
    }

    // RBAC Enforcements
    if (auth.role === "EMPLOYEE") {
      if (auth.employee.id !== targetEmployeeId) {
        return ApiResponse.forbidden("Employees can only view their own timeline");
      }
    } else if (auth.role === "MANAGER") {
      // Check if target employee belongs to the manager's department
      const targetEmp = await prisma.employee.findUnique({
        where: { id: targetEmployeeId },
        select: { departmentId: true }
      });
      if (!targetEmp || targetEmp.departmentId !== auth.employee.departmentId) {
        return ApiResponse.forbidden("Managers can only view timelines of employees in their department");
      }
    } else if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied");
    }

    const timeline = await TimelineService.getEmployeeTimeline(targetEmployeeId, targetDate);

    return NextResponse.json({
      success: true,
      data: { timeline },
    });
  } catch (error: any) {
    if (error.message === "Employee not found") {
      return ApiResponse.notFound("Employee not found");
    }
    return ApiResponse.serverError("Error fetching unified timeline", error);
  }
}
