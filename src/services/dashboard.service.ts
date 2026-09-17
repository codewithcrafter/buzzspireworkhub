import { prisma } from "@/lib/prisma";
import { getStartOfDay, getEndOfDay } from "@/lib/date";

export interface WorkHubDashboardStats {
  // Employee counts
  totalEmployees: number;
  activeEmployees: number;
  newThisMonth: number;

  // Today's attendance
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  attendanceRate: number;

  // Pending actions
  pendingLeaves: number;
  upcomingHolidays: UpcomingHoliday[];

  // Recent activity
  recentActivity: RecentActivity[];
}

export interface UpcomingHoliday {
  id: string;
  name: string;
  date: Date;
  type: string;
  daysUntil: number;
}

export interface RecentActivity {
  id: string;
  actorName: string;
  action: string;
  module: string;
  description: string;
  createdAt: Date;
}

/**
 * Aggregates real WorkHub KPIs for the dashboard overview.
 *
 * - totalEmployees / activeEmployees / newThisMonth: from Employee table
 * - presentToday / absentToday / lateToday / onLeaveToday: from Attendance table
 * - pendingLeaves: from Leave table (status=PENDING)
 * - upcomingHolidays: next 30 days from Holiday table
 * - recentActivity: last 10 ActivityLog entries
 *
 * @param scope  Optional department filter for Manager-scoped views.
 */
export async function getWorkHubDashboardStats(
  scope?: { departmentId?: string | null }
): Promise<WorkHubDashboardStats> {
  const now = new Date();
  const startOfToday = getStartOfDay(now);
  const endOfToday = getEndOfDay(now);

  // Month boundaries for "new this month"
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 30-day window for upcoming holidays
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Optional department scope (for MANAGER role)
  const deptFilter = scope?.departmentId
    ? { departmentId: scope.departmentId }
    : {};

  const [
    totalEmployees,
    activeEmployees,
    newThisMonth,
    todayAttendances,
    pendingLeaves,
    upcomingHolidaysRaw,
    recentActivityRaw,
  ] = await Promise.all([
    // 1. Total active employees (scoped)
    prisma.employee.count({
      where: { status: "ACTIVE", ...deptFilter },
    }),

    // 2. Active employees total
    prisma.employee.count({
      where: { status: "ACTIVE", ...deptFilter },
    }),

    // 3. New this month
    prisma.employee.count({
      where: {
        status: "ACTIVE",
        createdAt: { gte: startOfMonth },
        ...deptFilter,
      },
    }),

    // 4. Today's attendance records (with isLate flag)
    prisma.attendance.findMany({
      where: {
        date: { gte: startOfToday, lte: endOfToday },
        ...(scope?.departmentId
          ? { employee: { departmentId: scope.departmentId } }
          : {}),
      },
      select: {
        status: true,
        isLate: true,
      },
    }),

    // 5. Pending leave requests (scoped)
    prisma.leave.count({
      where: {
        status: "PENDING",
        ...(scope?.departmentId
          ? { employee: { departmentId: scope.departmentId } }
          : {}),
      },
    }),

    // 6. Upcoming holidays (next 30 days)
    prisma.holiday.findMany({
      where: {
        status: "ACTIVE",
        date: { gte: now, lte: in30Days },
      },
      orderBy: { date: "asc" },
      take: 5,
    }),

    // 7. Recent activity logs (last 10)
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        employee: {
          select: { fullName: true },
        },
      },
    }),
  ]);

  // Compute today attendance breakdown
  const presentToday = todayAttendances.filter(
    (a) => a.status === "PRESENT" || a.status === "LATE" || a.status === "HALF_DAY"
  ).length;
  const absentToday = todayAttendances.filter(
    (a) => a.status === "ABSENT"
  ).length;
  const lateToday = todayAttendances.filter((a) => a.isLate).length;
  const onLeaveToday = todayAttendances.filter(
    (a) => a.status === "ON_LEAVE"
  ).length;

  const attendanceRate =
    totalEmployees > 0
      ? Math.round((presentToday / totalEmployees) * 1000) / 10
      : 0;

  // Map upcoming holidays
  const upcomingHolidays: UpcomingHoliday[] = upcomingHolidaysRaw.map((h) => {
    const msUntil = h.date.getTime() - now.getTime();
    const daysUntil = Math.max(0, Math.ceil(msUntil / (1000 * 60 * 60 * 24)));
    return {
      id: h.id,
      name: h.name,
      date: h.date,
      type: h.type,
      daysUntil,
    };
  });

  // Map recent activity
  const recentActivity: RecentActivity[] = recentActivityRaw.map((a) => ({
    id: a.id,
    actorName: a.employee?.fullName ?? "System",
    action: a.action,
    module: a.module,
    description: a.description,
    createdAt: a.createdAt,
  }));

  return {
    totalEmployees,
    activeEmployees,
    newThisMonth,
    presentToday,
    absentToday,
    lateToday,
    onLeaveToday,
    attendanceRate,
    pendingLeaves,
    upcomingHolidays,
    recentActivity,
  };
}

/**
 * @deprecated Legacy agency function — kept for backward-compat.
 * Use getWorkHubDashboardStats() for the WorkHub dashboard.
 */
export async function getDashboardStats() {
  return getWorkHubDashboardStats();
}
