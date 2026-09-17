import { NextResponse } from "next/server";
import { getAuthSession, hasPermission, canAccessEmployee } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv, generatePdfReport } from "@/lib/export-utils";

// GET /api/reports/attendance/export
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    if (!hasPermission(auth.role, "EXPORT_ATTENDANCE") && auth.role !== "EMPLOYEE") {
      return ApiResponse.forbidden("Access denied: Permission EXPORT_ATTENDANCE required", req);
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

    // Scope enforcement
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
      const headers = ["Employee ID", "Name", "Department", "Date", "Status", "Work (hrs)", "Break (hrs)"];
      const rows = report.rows.map((r) => [
        r.employeeCode,
        r.fullName,
        r.department || "N/A",
        new Date(r.date).toLocaleDateString(),
        r.status,
        (r.totalWorkingSeconds / 3600).toFixed(1),
        (r.totalBreakSeconds / 3600).toFixed(1),
      ]);

      const pdfBuffer = await generatePdfReport("Attendance Export Report", headers, rows);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="attendance-report-${Date.now()}.pdf"`,
        },
      });
    }

    // Default CSV
    const headers = [
      { key: "employeeCode" as const, label: "Employee Code" },
      { key: "fullName" as const, label: "Employee Name" },
      { key: "department" as const, label: "Department" },
      { key: "date" as const, label: "Date" },
      { key: "status" as const, label: "Status" },
      { key: "totalWorkingSeconds" as const, label: "Working Seconds" },
      { key: "totalBreakSeconds" as const, label: "Break Seconds" },
      { key: "netWorkingSeconds" as const, label: "Net Working Seconds" },
    ];

    const formattedRows = report.rows.map((r) => ({
      ...r,
      date: new Date(r.date).toLocaleDateString(),
    }));

    const csvData = generateCsv(formattedRows, headers);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="attendance-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error exporting attendance report", error, req);
  }
}
