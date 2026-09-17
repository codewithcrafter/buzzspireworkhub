import { NextResponse } from "next/server";
import { getAuthSession, hasPermission } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv, generatePdfReport } from "@/lib/export-utils";

// GET /api/reports/working-hours/export
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    if (!hasPermission(auth.role, "EXPORT_WORKING_HOURS") && auth.role !== "EMPLOYEE") {
      return ApiResponse.forbidden("Access denied: Permission EXPORT_WORKING_HOURS required", req);
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
    const departmentId = searchParams.get("departmentId") || undefined;

    if (auth.role === "EMPLOYEE") {
      employeeId = auth.employee.id;
    } else if (auth.role === "MANAGER") {
      if (!auth.employee.departmentId) {
        return ApiResponse.forbidden("Manager has no assigned department", req);
      }
    }

    const report = await ReportService.getAttendanceReport({
      startDate,
      endDate,
      employeeId,
      departmentId: auth.role === "MANAGER" ? auth.employee.departmentId ?? undefined : departmentId,
      limit: 200,
    });

    if (format === "pdf") {
      const headers = ["Code", "Employee", "Date", "Gross Work (hrs)", "Break (hrs)", "Net Work (hrs)"];
      const rows = report.rows.map((r) => [
        r.employeeCode,
        r.fullName,
        new Date(r.date).toLocaleDateString(),
        (r.totalWorkingSeconds / 3600).toFixed(2),
        (r.totalBreakSeconds / 3600).toFixed(2),
        (r.netWorkingSeconds / 3600).toFixed(2),
      ]);

      const pdfBuffer = await generatePdfReport("Working Hours Export", headers, rows);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="working-hours-${Date.now()}.pdf"`,
        },
      });
    }

    const headers = [
      { key: "employeeCode" as const, label: "Employee Code" },
      { key: "fullName" as const, label: "Employee Name" },
      { key: "date" as const, label: "Date" },
      { key: "grossHours" as const, label: "Gross Working Hours" },
      { key: "breakHours" as const, label: "Break Hours" },
      { key: "netHours" as const, label: "Net Working Hours" },
    ];

    const formattedRows = report.rows.map((r) => ({
      employeeCode: r.employeeCode,
      fullName: r.fullName,
      date: new Date(r.date).toLocaleDateString(),
      grossHours: (r.totalWorkingSeconds / 3600).toFixed(2),
      breakHours: (r.totalBreakSeconds / 3600).toFixed(2),
      netHours: (r.netWorkingSeconds / 3600).toFixed(2),
    }));

    const csvData = generateCsv(formattedRows, headers);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="working-hours-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error exporting working hours data", error, req);
  }
}
