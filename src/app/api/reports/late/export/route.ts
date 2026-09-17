import { NextResponse } from "next/server";
import { getAuthSession, hasPermission } from "@/lib/auth/permissions";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv, generatePdfReport } from "@/lib/export-utils";
import { prisma } from "@/lib/prisma";

// GET /api/reports/late/export
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "csv").toLowerCase();

    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : defaultStart;
    const endDate = rawEnd ? new Date(rawEnd) : defaultEnd;

    let employeeId = searchParams.get("employeeId") || undefined;
    let departmentId = searchParams.get("departmentId") || undefined;

    if (auth.role === "EMPLOYEE") {
      employeeId = auth.employee.id;
      departmentId = undefined;
    } else if (auth.role === "MANAGER") {
      if (auth.employee.departmentId) {
        departmentId = auth.employee.departmentId;
      }
    }

    const where: any = {
      date: { gte: startDate, lte: endDate },
      OR: [{ isLate: true }, { status: "LATE" }],
    };

    if (employeeId) where.employeeId = employeeId;
    if (departmentId) where.employee = { departmentId };

    const records = await prisma.attendance.findMany({
      where,
      take: 200,
      orderBy: { date: "desc" },
      include: {
        employee: {
          select: {
            employeeCode: true,
            fullName: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    const rows = records.map((r) => ({
      employeeCode: r.employee.employeeCode,
      fullName: r.employee.fullName,
      department: r.employee.department?.name || "Unassigned",
      date: new Date(r.date).toLocaleDateString(),
      checkIn: r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "N/A",
      lateMinutes: String(r.lateMinutes),
      status: r.status,
    }));

    if (format === "pdf") {
      const headers = ["Code", "Employee", "Department", "Date", "Check-in", "Late (mins)", "Status"];
      const pdfRows = rows.map((r) => [
        r.employeeCode,
        r.fullName,
        r.department,
        r.date,
        r.checkIn,
        r.lateMinutes,
        r.status,
      ]);

      const pdfBuffer = await generatePdfReport("Late Attendance Report", headers, pdfRows);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="late-report-${Date.now()}.pdf"`,
        },
      });
    }

    // Default CSV
    const headers = [
      { key: "employeeCode" as const, label: "Employee Code" },
      { key: "fullName" as const, label: "Employee Name" },
      { key: "department" as const, label: "Department" },
      { key: "date" as const, label: "Date" },
      { key: "checkIn" as const, label: "Check-in Time" },
      { key: "lateMinutes" as const, label: "Late Minutes" },
      { key: "status" as const, label: "Status" },
    ];

    const csvData = generateCsv(rows, headers);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="late-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error exporting late report", error, req);
  }
}
