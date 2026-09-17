import { prisma } from "@/lib/prisma";

export interface ProductivityParams {
  startDate?: Date;
  endDate?: Date;
  employeeId?: string;
  departmentId?: string;
}

export class ProductivityService {
  /**
   * Calculate objective, operational productivity metrics based on WorkHub session data.
   * STRICTLY NO INVASIVE MONITORING (No screenshots, keyloggers, or hidden surveillance).
   */
  static async getProductivityMetrics(params: ProductivityParams) {
    const now = new Date();
    const startDate = params.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = params.endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const where: any = {
      date: { gte: startDate, lte: endDate },
    };

    if (params.employeeId || params.departmentId) {
      where.employee = {};
      if (params.employeeId) where.employee.id = params.employeeId;
      if (params.departmentId) where.employee.departmentId = params.departmentId;
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where,
      select: {
        id: true,
        employeeId: true,
        date: true,
        status: true,
        totalWorkingSeconds: true,
        totalBreakSeconds: true,
        netWorkingSeconds: true,
        sessions: { select: { id: true, workingSeconds: true } },
      },
    });

    const totalDaysCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const recordsCount = attendanceRecords.length || 1;

    const totalWorkingSeconds = attendanceRecords.reduce((acc, r) => acc + r.netWorkingSeconds, 0);
    const totalBreakSeconds = attendanceRecords.reduce((acc, r) => acc + r.totalBreakSeconds, 0);
    const totalPresentDays = attendanceRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;

    const attendanceConsistency = parseFloat(((totalPresentDays / totalDaysCount) * 100).toFixed(1));
    const averageDailyWorkingHours = parseFloat((totalWorkingSeconds / recordsCount / 3600).toFixed(2));
    const averageDailyBreakMinutes = parseFloat((totalBreakSeconds / recordsCount / 60).toFixed(1));

    const totalSessions = attendanceRecords.reduce((acc, r) => acc + r.sessions.length, 0);
    const sessionConsistency = parseFloat((totalSessions / recordsCount).toFixed(1));

    return {
      period: { startDate, endDate, totalDays: totalDaysCount },
      summary: {
        totalPresentDays,
        totalWorkingHours: parseFloat((totalWorkingSeconds / 3600).toFixed(2)),
        totalBreakHours: parseFloat((totalBreakSeconds / 3600).toFixed(2)),
        attendanceConsistencyPercentage: Math.min(100, attendanceConsistency),
        averageDailyWorkingHours,
        averageDailyBreakMinutes,
        sessionConsistency,
      },
    };
  }
}
