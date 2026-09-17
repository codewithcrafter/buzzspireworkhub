import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/reports/departments
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden(
        "Access denied: Insufficient permissions to view department reports"
      );
    }

    const { searchParams } = new URL(req.url);
    const departmentId =
      auth.role === "MANAGER"
        ? auth.employee.departmentId ?? undefined
        : searchParams.get("departmentId") || undefined;

    const departments = await prisma.department.findMany({
      where: departmentId ? { id: departmentId } : undefined,
      include: {
        _count: {
          select: { employees: { where: { status: "ACTIVE" } } },
        },
      },
      orderBy: { name: "asc" },
    });

    // Also get today's attendance by department
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const attendanceToday = await prisma.attendance.findMany({
      where: {
        date: { gte: startOfToday },
        employee: departmentId ? { departmentId } : undefined,
      },
      select: {
        status: true,
        employee: { select: { departmentId: true } },
      },
    });

    const report = departments.map((d) => {
      const deptAttendance = attendanceToday.filter((a) => a.employee?.departmentId === d.id);
      const present = deptAttendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
      const late = deptAttendance.filter((a) => a.status === "LATE").length;

      return {
        id: d.id,
        name: d.name,
        code: d.code,
        status: d.status,
        activeEmployees: d._count.employees,
        presentToday: present,
        lateToday: late,
      };
    });

    return NextResponse.json({ success: true, data: { departments: report } });
  } catch (error) {
    return ApiResponse.serverError("Error generating department report", error);
  }
}
