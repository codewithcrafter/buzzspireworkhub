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
    const dateParam = searchParams.get("date") || new Date().toISOString();
    
    // Determine scope based on RBAC
    let targetEmployeeIds: string[] = [];

    if (auth.role === "EMPLOYEE") {
      targetEmployeeIds = [auth.employee.id];
    } else if (auth.role === "MANAGER") {
      const employees = await prisma.employee.findMany({
        where: { departmentId: auth.employee.departmentId, status: "ACTIVE" },
        select: { id: true }
      });
      targetEmployeeIds = employees.map(e => e.id);
    } else {
      // ADMIN or HR_MANAGER
      const departmentId = searchParams.get("departmentId");
      const whereClause = departmentId ? { departmentId, status: "ACTIVE" as any } : { status: "ACTIVE" as any };
      const employees = await prisma.employee.findMany({
        where: whereClause,
        select: { id: true }
      });
      targetEmployeeIds = employees.map(e => e.id);
    }

    // Process all employees in scope for the requested date
    const results = await Promise.all(
      targetEmployeeIds.map(id => WorkingHoursService.calculateDaily(id, new Date(dateParam)))
    );

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving employee working hours", error);
  }
}
