import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv, generatePdfReport } from "@/lib/export-utils";
import { prisma } from "@/lib/prisma";

// GET /api/reports/departments/export
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Insufficient permissions to export department reports", req);
    }

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "csv").toLowerCase();

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

    const rows = departments.map((d) => {
      const deptAttendance = attendanceToday.filter((a) => a.employee?.departmentId === d.id);
      const present = deptAttendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
      const late = deptAttendance.filter((a) => a.status === "LATE").length;

      return {
        name: d.name,
        code: d.code,
        status: d.status,
        activeEmployees: d._count.employees,
        presentToday: present,
        lateToday: late,
      };
    });

    if (format === "pdf") {
      const headers = ["Department Name", "Code", "Status", "Active Employees", "Present Today", "Late Today"];
      const pdfRows = rows.map((r) => [
        r.name,
        r.code,
        r.status,
        String(r.activeEmployees),
        String(r.presentToday),
        String(r.lateToday),
      ]);

      const pdfBuffer = await generatePdfReport("Department Status & Attendance Report", headers, pdfRows);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="department-report-${Date.now()}.pdf"`,
        },
      });
    }

    // Default CSV
    const headers = [
      { key: "name" as const, label: "Department Name" },
      { key: "code" as const, label: "Department Code" },
      { key: "status" as const, label: "Status" },
      { key: "activeEmployees" as const, label: "Active Employees" },
      { key: "presentToday" as const, label: "Present Today" },
      { key: "lateToday" as const, label: "Late Today" },
    ];

    const csvData = generateCsv(rows, headers);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="department-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error exporting department report", error, req);
  }
}
