import { prisma } from "@/lib/prisma";

// ─── Attendance Report ────────────────────────────────────────────────────────

export interface AttendanceReportParams {
  startDate: Date;
  endDate: Date;
  employeeId?: string;
  departmentId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AttendanceReportRow {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  department: string | null;
  date: Date;
  status: string;
  totalWorkingSeconds: number;
  totalBreakSeconds: number;
  netWorkingSeconds: number;
}

// ─── Leave Report ─────────────────────────────────────────────────────────────

export interface LeaveReportParams {
  startDate: Date;
  endDate: Date;
  employeeId?: string;
  departmentId?: string;
  status?: string;
  leaveType?: string;
  page?: number;
  limit?: number;
}

// ─── Headcount / Summary ──────────────────────────────────────────────────────

export class ReportService {
  // ── 1. Attendance Report ──────────────────────────────────────────────────

  static async getAttendanceReport(params: AttendanceReportParams) {
    const {
      startDate,
      endDate,
      employeeId,
      departmentId,
      status,
      page = 1,
      limit = 50,
    } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 200);
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (status) where.status = status;

    if (employeeId || departmentId) {
      where.employee = {};
      if (employeeId) where.employee.id = employeeId;
      if (departmentId) where.employee.departmentId = departmentId;
    }

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: [{ date: "desc" }, { employee: { fullName: "asc" } }],
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              employeeCode: true,
              fullName: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    // Aggregate summary counts
    const allStatuses = await prisma.attendance.groupBy({
      by: ["status"],
      where,
      _count: { status: true },
    });

    const statusSummary = allStatuses.reduce(
      (acc, row) => {
        acc[row.status] = row._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    const rows: AttendanceReportRow[] = records.map((r) => ({
      attendanceId: r.id,
      employeeId: r.employee.employeeId,
      employeeCode: r.employee.employeeCode,
      fullName: r.employee.fullName,
      department: r.employee.department?.name ?? null,
      date: r.date,
      status: r.status,
      totalWorkingSeconds: r.totalWorkingSeconds,
      totalBreakSeconds: r.totalBreakSeconds,
      netWorkingSeconds: r.netWorkingSeconds,
    }));

    return {
      rows,
      summary: statusSummary,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  // ── 2. Leave Report ───────────────────────────────────────────────────────

  static async getLeaveReport(params: LeaveReportParams) {
    const {
      startDate,
      endDate,
      employeeId,
      departmentId,
      status,
      leaveType,
      page = 1,
      limit = 50,
    } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 200);
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      startDate: { gte: startDate },
      endDate: { lte: endDate },
    };

    if (status) where.status = status;
    if (leaveType) where.leaveType = leaveType;

    if (employeeId || departmentId) {
      where.employee = {};
      if (employeeId) where.employee.id = employeeId;
      if (departmentId) where.employee.departmentId = departmentId;
    }

    const [records, total] = await Promise.all([
      prisma.leave.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              employeeCode: true,
              fullName: true,
              department: { select: { name: true } },
            },
          },
          reviewer: {
            select: { fullName: true, employeeId: true },
          },
        },
      }),
      prisma.leave.count({ where }),
    ]);

    const statusSummary = await prisma.leave.groupBy({
      by: ["status"],
      where,
      _count: { status: true },
      _sum: { totalDays: true },
    });

    const summary = statusSummary.reduce(
      (acc, row) => {
        acc[row.status] = {
          count: row._count.status,
          totalDays: row._sum.totalDays ?? 0,
        };
        return acc;
      },
      {} as Record<string, { count: number; totalDays: number }>
    );

    return {
      rows: records,
      summary,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  // ── 3. Employee Headcount Report ──────────────────────────────────────────

  static async getHeadcountReport() {
    const [byStatus, byDepartment, byRole, total] = await Promise.all([
      prisma.employee.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.employee.groupBy({
        by: ["departmentId"],
        _count: { departmentId: true },
        where: { status: "ACTIVE" },
      }),
      prisma.employee.groupBy({
        by: ["roleId"],
        _count: { roleId: true },
        where: { status: "ACTIVE" },
      }),
      prisma.employee.count(),
    ]);

    // Enrich department names
    const departmentIds = byDepartment
      .map((r) => r.departmentId)
      .filter(Boolean) as string[];

    const departments =
      departmentIds.length > 0
        ? await prisma.department.findMany({
            where: { id: { in: departmentIds } },
            select: { id: true, name: true },
          })
        : [];

    const deptMap = new Map(departments.map((d) => [d.id, d.name]));

    // Enrich role names
    const roleIds = byRole.map((r) => r.roleId);
    const roles = await prisma.role.findMany({
      where: { id: { in: roleIds } },
      select: { id: true, name: true },
    });
    const roleMap = new Map(roles.map((r) => [r.id, r.name]));

    return {
      total,
      byStatus: byStatus.map((r) => ({
        status: r.status,
        count: r._count.status,
      })),
      byDepartment: byDepartment.map((r) => ({
        departmentId: r.departmentId,
        departmentName: r.departmentId ? (deptMap.get(r.departmentId) ?? "Unassigned") : "Unassigned",
        count: r._count.departmentId,
      })),
      byRole: byRole.map((r) => ({
        roleId: r.roleId,
        roleName: roleMap.get(r.roleId) ?? r.roleId,
        count: r._count.roleId,
      })),
    };
  }

  // ── 4. Dashboard Summary (quick stats for HR/Admin dashboards) ────────────

  static async getDashboardSummary() {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalEmployees,
      activeEmployees,
      todayAttendance,
      pendingLeaves,
      monthLeaves,
      totalDepartments,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.attendance.count({ where: { date: { gte: startOfToday } } }),
      prisma.leave.count({ where: { status: "PENDING" } }),
      prisma.leave.count({
        where: { startDate: { gte: startOfMonth }, status: "APPROVED" },
      }),
      prisma.department.count({ where: { status: "ACTIVE" } }),
    ]);

    const todayPresent = await prisma.attendance.count({
      where: { date: { gte: startOfToday }, status: "PRESENT" },
    });

    return {
      totalEmployees,
      activeEmployees,
      todayAttendance,
      todayPresent,
      todayAbsent: activeEmployees - todayPresent,
      pendingLeaves,
      monthLeaves,
      totalDepartments,
    };
  }

  // ── 5. Advanced Attendance Analytics ──────────────────────────────────────

  static async getAttendanceAnalytics(params: AttendanceReportParams) {
    const { startDate, endDate, employeeId, departmentId } = params;

    const where: any = {
      date: { gte: startDate, lte: endDate },
    };

    if (employeeId || departmentId) {
      where.employee = {};
      if (employeeId) where.employee.id = employeeId;
      if (departmentId) where.employee.departmentId = departmentId;
    }

    const [records, totalEmployees] = await Promise.all([
      prisma.attendance.findMany({
        where,
        select: {
          status: true,
          totalWorkingSeconds: true,
          totalBreakSeconds: true,
          netWorkingSeconds: true,
          sessions: { select: { id: true } },
        },
      }),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
    ]);

    const recordCount = records.length || 1;
    const totalWorkingSecs = records.reduce((acc, r) => acc + r.netWorkingSeconds, 0);
    const totalBreakSecs = records.reduce((acc, r) => acc + r.totalBreakSeconds, 0);
    const lateArrivalsCount = records.filter((r) => r.status === "LATE").length;
    const presentCount = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
    const absentCount = records.filter((r) => r.status === "ABSENT").length;
    const totalSessions = records.reduce((acc, r) => acc + r.sessions.length, 0);

    return {
      totalRecords: records.length,
      averageWorkingHours: parseFloat((totalWorkingSecs / recordCount / 3600).toFixed(2)),
      averageBreakMinutes: parseFloat((totalBreakSecs / recordCount / 60).toFixed(1)),
      lateArrivals: lateArrivalsCount,
      presentCount,
      absentCount,
      attendancePercentage: parseFloat(((presentCount / recordCount) * 100).toFixed(1)),
      absencePercentage: parseFloat(((absentCount / recordCount) * 100).toFixed(1)),
      totalSessionsCount: totalSessions,
      averageSessionsPerDay: parseFloat((totalSessions / recordCount).toFixed(1)),
    };
  }
}

