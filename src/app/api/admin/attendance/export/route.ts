import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";
import { generateCsv } from "@/lib/export-utils";
import { formatSecondsToHMS, getKolkataDateString } from "@/lib/date";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/attendance/export
 * Exports comprehensive daily or historical attendance records to CSV.
 * Supported query params:
 *   - date: YYYY-MM-DD (defaults to today in IST)
 *   - department: department ID filter
 *   - status: status filter (ALL, PRESENT, LATE, ABSENT, ON_BREAK, etc.)
 */
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to export attendance records.");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Administrative permissions required to export attendance data.");
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date") || undefined;
    let departmentId = searchParams.get("department") || searchParams.get("departmentId") || undefined;
    const statusParam = searchParams.get("status") || undefined;

    // Scope enforcement for Department Managers
    if (auth.role === "MANAGER") {
      if (!auth.employee?.departmentId) {
        return ApiResponse.forbidden("Manager has no assigned department.");
      }
      departmentId = auth.employee.departmentId;
    }

    const targetDateStr = dateParam || getKolkataDateString(new Date());

    // Retrieve full live attendance states for the requested date and filters
    const liveStates = await AttendanceService.getLiveAttendanceStates({
      date: targetDateStr,
      departmentId: departmentId === "ALL" ? undefined : departmentId,
      status: statusParam === "ALL" ? undefined : statusParam,
    });

    const formatTimeOnly = (dStr: string | Date | null | undefined) => {
      if (!dStr) return "--:--";
      try {
        return new Date(dStr).toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch {
        return "--:--";
      }
    };

    const formatHoursMinutes = (seconds: number) => {
      const s = Math.max(0, Math.floor(seconds || 0));
      const hrs = Math.floor(s / 3600);
      const mins = Math.floor((s % 3600) / 60);
      return `${hrs}h ${mins}m`;
    };

    const formatMinutesOnly = (seconds: number) => {
      const mins = Math.floor(Math.max(0, seconds || 0) / 60);
      return `${mins}m`;
    };

    const csvRows = liveStates.map((s) => {
      const breakSummary = (s.breakHistory || [])
        .map((b) => {
          const durMin = Math.floor((b.durationSeconds || 0) / 60);
          return `${b.breakTypeName} (${durMin}m)`;
        })
        .join("; ") || "None";

      return {
        date: targetDateStr,
        employeeCode: s.employeeCode || "N/A",
        fullName: s.fullName || "N/A",
        department: s.department || "General",
        designation: s.designation || "Staff",
        status: s.status || "ABSENT",
        liveState: s.currentState || "ABSENT",
        punchIn: formatTimeOnly(s.punchIn),
        punchOut: formatTimeOnly(s.lastPunchOut),
        totalWorkingHours: formatHoursMinutes(s.totalWorkingSeconds),
        totalWorkingSeconds: s.totalWorkingSeconds || 0,
        netWorkingHours: formatHoursMinutes(s.netWorkingSeconds),
        netWorkingSeconds: s.netWorkingSeconds || 0,
        breakCount: (s.breakHistory || []).length,
        totalBreakTime: formatHoursMinutes(s.totalBreakSeconds),
        totalBreakSeconds: s.totalBreakSeconds || 0,
        declaredBreakTime: formatMinutesOnly(s.declaredBreakSeconds),
        idleBreakTime: formatMinutesOnly(s.idleBreakSeconds),
        breakSummary,
        lateMinutes: s.lateMinutes || 0,
        overtimeMinutes: s.overtimeMinutes || 0,
        shortfallMinutes: s.shortfallMinutes || 0,
      };
    });

    const headers = [
      { key: "date" as const, label: "Date" },
      { key: "employeeCode" as const, label: "Employee Code" },
      { key: "fullName" as const, label: "Full Name" },
      { key: "department" as const, label: "Department" },
      { key: "designation" as const, label: "Designation" },
      { key: "status" as const, label: "Attendance Status" },
      { key: "liveState" as const, label: "Current State" },
      { key: "punchIn" as const, label: "Punch In" },
      { key: "punchOut" as const, label: "Punch Out" },
      { key: "totalWorkingHours" as const, label: "Total Working (HH:MM)" },
      { key: "totalWorkingSeconds" as const, label: "Working Seconds" },
      { key: "netWorkingHours" as const, label: "Net Effective (HH:MM)" },
      { key: "netWorkingSeconds" as const, label: "Net Working Seconds" },
      { key: "breakCount" as const, label: "Breaks Count" },
      { key: "totalBreakTime" as const, label: "Total Break Time" },
      { key: "totalBreakSeconds" as const, label: "Break Seconds" },
      { key: "declaredBreakTime" as const, label: "Declared Breaks" },
      { key: "idleBreakTime" as const, label: "Idle Breaks" },
      { key: "breakSummary" as const, label: "Break Details" },
      { key: "lateMinutes" as const, label: "Late (Mins)" },
      { key: "overtimeMinutes" as const, label: "Overtime (Mins)" },
      { key: "shortfallMinutes" as const, label: "Shortfall (Mins)" },
    ];

    const csvContent = generateCsv(csvRows, headers);

    const filename = `attendance-report-${targetDateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("Attendance CSV Export Error:", error);
    return ApiResponse.serverError("Error generating attendance CSV export", error);
  }
}
