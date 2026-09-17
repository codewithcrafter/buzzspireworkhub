import { prisma } from "@/lib/prisma";
import { WorkingHoursService } from "./working-hours.service";

export class HREngineService {
  /**
   * Recalculates all HR metrics for a specific attendance record by delegating to the centralized WorkingHoursService.
   * Typically called when a break ends or when the employee punches out.
   */
  static async recalculateAttendance(attendanceId: string) {
    // 1. Fetch attendance to get the employeeId and date
    const attendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        employee: { select: { role: { select: { name: true } } } },
      },
    });

    if (!attendance) throw new Error("ATTENDANCE_NOT_FOUND");
    if (attendance.employee.role.name === "ADMIN") return null;

    // 2. Delegate to authoritative calculation layer
    const metrics = await WorkingHoursService.calculateDaily(attendance.employeeId, attendance.date);

    // 3. Update Database to match the authoritative calculation exactly
    const updated = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        totalWorkingSeconds: metrics.grossSpanMinutes * 60, // HREngine expects seconds, WorkingHoursService outputs minutes
        totalBreakSeconds: metrics.declaredBreakMinutes * 60,
        idleSeconds: metrics.idleMinutes * 60,
        netWorkingSeconds: metrics.workingMinutes * 60,
        shortfallMinutes: metrics.shortfallMinutes,
        overtimeMinutes: metrics.overtimeMinutes,
        earlyLogoutMinutes: metrics.earlyLogoutMinutes,
        lateMinutes: metrics.lateMinutes,
        status: metrics.status as any,
      },
    });

    return updated;
  }
}
