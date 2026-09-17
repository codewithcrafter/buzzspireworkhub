import { NextResponse } from "next/server";
import { getAuthSession, hasPermission } from "@/lib/auth/permissions";
import { ReportService } from "@/services/report.service";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv, generatePdfReport } from "@/lib/export-utils";

// GET /api/reports/leaves/export
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    if (!hasPermission(auth.role, "EXPORT_LEAVE") && auth.role !== "EMPLOYEE") {
      return ApiResponse.forbidden("Access denied: Permission EXPORT_LEAVE required", req);
    }

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "csv").toLowerCase();

    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), 0, 1);
    const defaultEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

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

    const report = await ReportService.getLeaveReport({
      startDate,
      endDate,
      employeeId,
      departmentId: auth.role === "MANAGER" ? auth.employee.departmentId ?? undefined : departmentId,
      limit: 200,
    });

    if (format === "pdf") {
      const headers = ["Employee Code", "Name", "Leave Type", "Start Date", "End Date", "Days", "Status"];
      const rows = report.rows.map((r) => [
        r.employee.employeeCode,
        r.employee.fullName,
        r.leaveType,
        new Date(r.startDate).toLocaleDateString(),
        new Date(r.endDate).toLocaleDateString(),
        String(r.totalDays),
        r.status,
      ]);

      const pdfBuffer = await generatePdfReport("Leave Report Export", headers, rows);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="leaves-report-${Date.now()}.pdf"`,
        },
      });
    }

    const headers = [
      { key: "employeeCode" as const, label: "Employee Code" },
      { key: "fullName" as const, label: "Employee Name" },
      { key: "leaveType" as const, label: "Leave Type" },
      { key: "startDate" as const, label: "Start Date" },
      { key: "endDate" as const, label: "End Date" },
      { key: "totalDays" as const, label: "Total Days" },
      { key: "status" as const, label: "Status" },
      { key: "reason" as const, label: "Reason" },
    ];

    const formattedRows = report.rows.map((r) => ({
      employeeCode: r.employee.employeeCode,
      fullName: r.employee.fullName,
      leaveType: r.leaveType,
      startDate: new Date(r.startDate).toLocaleDateString(),
      endDate: new Date(r.endDate).toLocaleDateString(),
      totalDays: r.totalDays,
      status: r.status,
      reason: r.reason,
    }));

    const csvData = generateCsv(formattedRows, headers);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leaves-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error exporting leaves report", error, req);
  }
}
