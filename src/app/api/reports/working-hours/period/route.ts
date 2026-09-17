import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { WorkingHoursService } from "@/services/working-hours.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate") || new Date().toISOString();
    const endDateParam = searchParams.get("endDate") || new Date().toISOString();
    let employeeId = searchParams.get("employeeId") || auth.employee.id;

    // RBAC: If an employee tries to fetch another employee's record
    if (auth.role === "EMPLOYEE" && employeeId !== auth.employee.id) {
      return ApiResponse.forbidden("You do not have permission to view this data.");
    }

    // RBAC: If a MANAGER tries to fetch someone outside their department
    if (auth.role === "MANAGER" && employeeId !== auth.employee.id) {
       const targetEmployee = await prisma.employee.findUnique({
           where: { id: employeeId },
           select: { departmentId: true }
       });
       if (!targetEmployee || targetEmployee.departmentId !== auth.employee.departmentId) {
           return ApiResponse.forbidden("Employee not found in your department.");
       }
    }

    const data = await WorkingHoursService.calculatePeriod(employeeId, new Date(startDateParam), new Date(endDateParam));

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return ApiResponse.serverError("Error calculating periodic working hours", error);
  }
}
