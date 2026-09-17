import { prisma } from "@/lib/prisma";
import { getStartOfDay, getEndOfDay, calculateDurationSeconds, getKolkataDateString, calculateLateStatus } from "@/lib/date";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";
import { HREngineService } from "./hr-engine.service";

export class AttendanceService {
  /**
   * Retrieves today's attendance record along with sessions, breaks, and current status for an employee.
   */
  static async getTodayAttendance(employeeId: string, dateInput?: Date | string) {
    const startOfDay = getStartOfDay(dateInput);
    const endOfDay = getEndOfDay(dateInput);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        sessions: {
          orderBy: { createdAt: "asc" },
          include: {
            breaks: {
              orderBy: { createdAt: "asc" },
              include: {
                breakType: true,
              },
            },
          },
        },
      },
    });

    if (!attendance) {
      return null;
    }

    // Determine active open session & break state
    const activeSession = attendance.sessions.find((s) => !s.punchOut);
    const activeBreak = activeSession?.breaks.find((b) => !b.endTime);

    // Dynamic live calculations
    let liveWorkingSeconds = attendance.totalWorkingSeconds;
    let liveBreakSeconds = attendance.totalBreakSeconds;

    const now = new Date();

    if (activeSession) {
      const currentSessionElapsed = calculateDurationSeconds(activeSession.punchIn, now);
      // Closed sessions total + current open session elapsed
      const closedSessionsSum = attendance.sessions
        .filter((s) => s.punchOut)
        .reduce((sum, s) => sum + (s.workingSeconds || 0), 0);

      liveWorkingSeconds = closedSessionsSum + currentSessionElapsed;
    }

    if (activeBreak) {
      const currentBreakElapsed = calculateDurationSeconds(activeBreak.startTime, now);
      const closedBreaksSum = attendance.sessions.flatMap((s) => s.breaks)
        .filter((b) => b.endTime)
        .reduce((sum, b) => sum + (b.durationSeconds || 0), 0);

      liveBreakSeconds = closedBreaksSum + currentBreakElapsed;
    }

    const liveNetWorkingSeconds = Math.max(0, liveWorkingSeconds - liveBreakSeconds);

    let currentState: "NOT_PUNCHED_IN" | "WORKING" | "ON_BREAK" | "COMPLETED" = "NOT_PUNCHED_IN";
    if (activeBreak) {
      currentState = "ON_BREAK";
    } else if (activeSession) {
      currentState = "WORKING";
    } else if (attendance.sessions.length > 0) {
      currentState = "COMPLETED";
    }

    return {
      id: attendance.id,
      date: attendance.date,
      dateString: getKolkataDateString(attendance.date),
      status: attendance.status,
      currentState,
      totalWorkingSeconds: liveWorkingSeconds,
      totalBreakSeconds: liveBreakSeconds,
      netWorkingSeconds: liveNetWorkingSeconds,
      shortfallMinutes: attendance.shortfallMinutes,
      overtimeMinutes: attendance.overtimeMinutes,
      earlyLogoutMinutes: attendance.earlyLogoutMinutes,
      lateMinutes: attendance.lateMinutes,
      activeSession: activeSession
        ? {
            id: activeSession.id,
            punchIn: activeSession.punchIn,
            workingSeconds: calculateDurationSeconds(activeSession.punchIn, now),
          }
        : null,
      activeBreak: activeBreak
        ? {
            id: activeBreak.id,
            breakTypeId: activeBreak.breakTypeId,
            breakTypeName: activeBreak.breakType?.name || "Break",
            startTime: activeBreak.startTime,
            durationSeconds: calculateDurationSeconds(activeBreak.startTime, now),
          }
        : null,
      sessions: attendance.sessions,
    };
  }

  /**
   * Handles PUNCH IN for an employee (atomic transaction).
   */
  static async punchIn(employeeId: string, ipAddress?: string, userAgent?: string) {
    const now = new Date();
    const startOfDay = getStartOfDay(now);
    const endOfDay = getEndOfDay(now);

    return prisma.$transaction(async (tx) => {
      // 1. Verify employee exists and is active
      const employee = await tx.employee.findUnique({
        where: { id: employeeId },
        select: { id: true, status: true, shiftStart: true, lastWorkingDate: true, role: { select: { name: true } } },
      });

      if (!employee || employee.status === "EXITED" || employee.status === "TERMINATED") {
        throw new Error("EMPLOYMENT_ENDED");
      }
      if (employee.lastWorkingDate && getStartOfDay(now) > getStartOfDay(employee.lastWorkingDate)) {
        throw new Error("BEYOND_LAST_WORKING_DATE");
      }

      if (employee.role.name === "ADMIN") {
        throw new Error("ADMIN_ATTENDANCE_NOT_ALLOWED");
      }

      // 2. Check existing open session for employee
      const existingOpenSession = await tx.attendanceSession.findFirst({
        where: {
          employeeId,
          punchOut: null,
        },
      });

      if (existingOpenSession) {
        throw new Error("ALREADY_PUNCHED_IN");
      }

      // 3. Find or create today's Attendance container record
      let attendance = await tx.attendance.findFirst({
        where: {
          employeeId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const lateCalc = calculateLateStatus(now, employee.shiftStart || "09:00", 15);

      if (!attendance) {
        attendance = await tx.attendance.create({
          data: {
            employeeId,
            date: startOfDay,
            checkIn: now,
            status: lateCalc.isLate ? "LATE" : "PRESENT",
            isLate: lateCalc.isLate,
            lateMinutes: lateCalc.lateMinutes,
            totalWorkingSeconds: 0,
            totalBreakSeconds: 0,
            netWorkingSeconds: 0,
          },
        });
      } else {
        await tx.attendance.update({
          where: { id: attendance.id },
          data: {
            checkIn: attendance.checkIn || now,
            status: attendance.isLate || lateCalc.isLate ? "LATE" : attendance.status,
            isLate: attendance.isLate || lateCalc.isLate,
            lateMinutes: Math.max(attendance.lateMinutes, lateCalc.lateMinutes),
          },
        });
      }

      // 4. Create new AttendanceSession
      const session = await tx.attendanceSession.create({
        data: {
          attendanceId: attendance.id,
          employeeId,
          punchIn: now,
          workingSeconds: 0,
        },
      });

      // 5. Create Activity & Audit records
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "PUNCH_IN",
          module: "ATTENDANCE",
          description: `Punched in at ${now.toLocaleTimeString("en-IN")}${lateCalc.isLate ? ` (${lateCalc.lateMinutes}m late)` : ""}`,
          metadata: { sessionId: session.id, ipAddress, isLate: lateCalc.isLate, lateMinutes: lateCalc.lateMinutes },
        },
      });

      await tx.auditLog.create({
        data: {
          employeeId,
          action: "ATTENDANCE_PUNCH_IN",
          module: "ATTENDANCE",
          description: `Punch in recorded for employee ID: ${employeeId}${lateCalc.isLate ? ` (LATE: ${lateCalc.lateMinutes}m)` : ""}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: { sessionId: session.id, isLate: lateCalc.isLate, lateMinutes: lateCalc.lateMinutes },
        },
      });

      return session;
    });
  }

  /**
   * Handles PUNCH OUT for an employee (atomic transaction).
   */
  static async punchOut(employeeId: string, ipAddress?: string, userAgent?: string) {
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find active open session
      const activeSession = await tx.attendanceSession.findFirst({
        where: {
          employeeId,
          punchOut: null,
        },
        include: {
          attendance: true,
          breaks: true,
        },
      });

      if (!activeSession) {
        throw new Error("NO_ACTIVE_SESSION");
      }

      // 2. Prevent punch out during an active break
      const activeBreak = activeSession.breaks.find((b) => !b.endTime);
      if (activeBreak) {
        throw new Error("ACTIVE_BREAK_MUST_END_FIRST");
      }

      // 3. Calculate session working seconds
      const sessionWorkingSeconds = calculateDurationSeconds(activeSession.punchIn, now);

      // 4. Close attendance session
      await tx.attendanceSession.update({
        where: { id: activeSession.id },
        data: {
          punchOut: now,
          workingSeconds: sessionWorkingSeconds,
        },
      });

      // 5. Recompute attendance totals for today
      const allAttendanceSessions = await tx.attendanceSession.findMany({
        where: { attendanceId: activeSession.attendanceId },
        include: { breaks: true },
      });

      const totalWorking = allAttendanceSessions.reduce(
        (sum, s) => sum + (s.id === activeSession.id ? sessionWorkingSeconds : s.workingSeconds || 0),
        0
      );

      const totalBreaks = allAttendanceSessions
        .flatMap((s) => s.breaks)
        .reduce((sum, b) => sum + (b.durationSeconds || 0), 0);

      const netWorking = Math.max(0, totalWorking - totalBreaks);

      await tx.attendance.update({
        where: { id: activeSession.attendanceId },
        data: {
          checkOut: now,
          totalWorkingSeconds: totalWorking,
          totalBreakSeconds: totalBreaks,
          netWorkingSeconds: netWorking,
        },
      });

      // Recalculate HR metrics using the Centralized Engine
      // Note: We run it after the tx, or inside it. Since HREngine opens its own queries, we should run it after the transaction or pass the tx to it.
      // To keep it clean, we'll run it after the transaction returns.

      // 6. Audit & Activity
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "PUNCH_OUT",
          module: "ATTENDANCE",
          description: `Punched out at ${now.toLocaleTimeString("en-IN")}`,
          metadata: { sessionId: activeSession.id, sessionWorkingSeconds },
        },
      });

      await tx.auditLog.create({
        data: {
          employeeId,
          action: "ATTENDANCE_PUNCH_OUT",
          module: "ATTENDANCE",
          description: `Punch out recorded. Session duration: ${sessionWorkingSeconds}s`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: { sessionId: activeSession.id, sessionWorkingSeconds },
        },
      });

      return {
        sessionId: activeSession.id,
        attendanceId: activeSession.attendanceId,
        punchOut: now,
        workingSeconds: sessionWorkingSeconds,
        totalWorkingSeconds: totalWorking,
        netWorkingSeconds: netWorking,
      };
    });

    // Run HR engine calculations after the transaction has committed
    await HREngineService.recalculateAttendance(result.attendanceId).catch((e) => {
      console.error("Failed to run HR Engine after punchOut", e);
    });

    return result;
  }

  /**
   * Starts a break for an employee (atomic transaction).
   */
  static async startBreak(
    employeeId: string,
    breakTypeId: string,
    purpose?: string,
    ipAddress?: string,
    userAgent?: string,
    overrideStartTime?: string,
    isIdleFallback?: boolean
  ) {
    const now = new Date();
    const effectiveStartTime = overrideStartTime ? new Date(overrideStartTime) : now;

    return prisma.$transaction(async (tx) => {
      // 1. Verify active open session
      const activeSession = await tx.attendanceSession.findFirst({
        where: {
          employeeId,
          punchOut: null,
        },
        include: {
          breaks: true,
        },
      });

      if (!activeSession) {
        throw new Error("NO_ACTIVE_SESSION");
      }

      // 2. Check no break is currently active
      const activeBreak = activeSession.breaks.find((b) => !b.endTime);
      if (activeBreak) {
        throw new Error("BREAK_ALREADY_ACTIVE");
      }

      // 3. Verify break type or create Idle Break if fallback
      let finalBreakTypeId = breakTypeId;
      let finalBreakTypeName = "";
      
      if (isIdleFallback) {
        let idleBreakType = await tx.breakType.findUnique({
          where: { name: "Idle Break" },
        });
        if (!idleBreakType) {
          idleBreakType = await tx.breakType.create({
            data: {
              name: "Idle Break",
              description: "System generated idle break due to inactivity",
              status: "ACTIVE",
            },
          });
        }
        finalBreakTypeId = idleBreakType.id;
        finalBreakTypeName = idleBreakType.name;
      } else {
        const breakType = await tx.breakType.findUnique({
          where: { id: breakTypeId },
        });

        if (!breakType) {
          throw new Error("BREAK_TYPE_NOT_FOUND");
        }

        if (breakType.name === "Other" && !purpose) {
          throw new Error("PURPOSE_REQUIRED_FOR_OTHER_BREAK");
        }
        
        finalBreakTypeName = breakType.name;
      }

      // 4. Create Break record
      const newBreak = await tx.break.create({
        data: {
          attendanceSessionId: activeSession.id,
          breakTypeId: finalBreakTypeId,
          purpose,
          startTime: effectiveStartTime,
          durationSeconds: 0,
        },
      });

      // 5. Audit & Activity
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "BREAK_STARTED",
          module: "ATTENDANCE",
          description: `Started break: ${finalBreakTypeName}${isIdleFallback ? ' (Auto-Fallback)' : ''}`,
          metadata: { breakId: newBreak.id, breakTypeName: finalBreakTypeName, isIdleFallback },
        },
      });

      await tx.auditLog.create({
        data: {
          employeeId,
          action: "BREAK_STARTED",
          module: "ATTENDANCE",
          description: `Break started (${finalBreakTypeName}) for employee ID: ${employeeId}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: { breakId: newBreak.id, isIdleFallback },
        },
      });

      return {
        id: newBreak.id,
        breakTypeName: finalBreakTypeName,
        startTime: effectiveStartTime,
      };
    });
  }

  /**
   * Ends an active break for an employee (atomic transaction).
   */
  static async endBreak(employeeId: string, ipAddress?: string, userAgent?: string) {
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find active open session
      const activeSession = await tx.attendanceSession.findFirst({
        where: {
          employeeId,
          punchOut: null,
        },
        include: {
          breaks: {
            include: { breakType: true },
          },
        },
      });

      if (!activeSession) {
        throw new Error("NO_ACTIVE_SESSION");
      }

      // 2. Find active break
      const activeBreak = activeSession.breaks.find((b) => !b.endTime);
      if (!activeBreak) {
        throw new Error("NO_ACTIVE_BREAK");
      }

      // 3. Calculate break duration
      const breakDurationSeconds = calculateDurationSeconds(activeBreak.startTime, now);

      // 4. Close break
      const closedBreak = await tx.break.update({
        where: { id: activeBreak.id },
        data: {
          endTime: now,
          durationSeconds: breakDurationSeconds,
        },
      });

      // 5. Update attendance total break seconds
      const allAttendanceSessions = await tx.attendanceSession.findMany({
        where: { attendanceId: activeSession.attendanceId },
        include: { breaks: true },
      });

      const totalBreaks = allAttendanceSessions
        .flatMap((s) => s.breaks)
        .reduce(
          (sum, b) => sum + (b.id === activeBreak.id ? breakDurationSeconds : b.durationSeconds || 0),
          0
        );

      const attRecord = await tx.attendance.findUnique({
        where: { id: activeSession.attendanceId },
        select: { totalWorkingSeconds: true },
      });
      const netWorking = Math.max(0, (attRecord?.totalWorkingSeconds || 0) - totalBreaks);

      await tx.attendance.update({
        where: { id: activeSession.attendanceId },
        data: {
          totalBreakSeconds: totalBreaks,
          netWorkingSeconds: netWorking,
        },
      });

      // 6. Audit & Activity
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "BREAK_ENDED",
          module: "ATTENDANCE",
          description: `Ended break: ${activeBreak.breakType?.name || "Break"} (${breakDurationSeconds}s)`,
          metadata: { breakId: activeBreak.id, breakDurationSeconds },
        },
      });

      await tx.auditLog.create({
        data: {
          employeeId,
          action: "BREAK_ENDED",
          module: "ATTENDANCE",
          description: `Break ended (${breakDurationSeconds}s duration)`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: { breakId: activeBreak.id, breakDurationSeconds },
        },
      });

      return {
        id: closedBreak.id,
        endTime: now,
        durationSeconds: breakDurationSeconds,
        totalBreakSeconds: totalBreaks,
      };
    });
  }

  /**
   * Retrieves paginated attendance history for an employee.
   */
  static async getEmployeeAttendanceHistory(
    employeeId: string,
    options: { startDate?: string; endDate?: string; status?: string; page?: number; limit?: number } = {}
  ) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = { employeeId };

    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = getStartOfDay(options.startDate);
      }
      if (options.endDate) {
        where.date.lte = getEndOfDay(options.endDate);
      }
    }

    if (options.status && options.status !== "ALL") {
      where.status = options.status as any;
    }

    const [total, attendances] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          sessions: {
            orderBy: { createdAt: "asc" },
            include: {
              breaks: {
                orderBy: { createdAt: "asc" },
                include: { breakType: true },
              },
            },
          },
        },
      }),
    ]);

    const formatted = attendances.map((att) => {
      const firstPunchIn = att.sessions[0]?.punchIn || null;
      const lastSession = att.sessions[att.sessions.length - 1];
      const lastPunchOut = lastSession?.punchOut || null;

      return {
        id: att.id,
        date: att.date,
        dateString: getKolkataDateString(att.date),
        status: att.status,
        firstPunchIn,
        lastPunchOut,
        totalWorkingSeconds: att.totalWorkingSeconds,
        totalBreakSeconds: att.totalBreakSeconds,
        netWorkingSeconds: att.netWorkingSeconds,
        sessionsCount: att.sessions.length,
        sessions: att.sessions,
      };
    });

    return {
      history: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Retrieves single attendance details by ID (with authorization check).
   */
  static async getAttendanceById(id: string, requestingEmployeeId: string, requestingRole: string, requestingDepartmentId?: string | null) {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            role: true,
            department: true,
          },
        },
        sessions: {
          orderBy: { createdAt: "asc" },
          include: {
            breaks: {
              orderBy: { createdAt: "asc" },
              include: {
                breakType: true,
              },
            },
          },
        },
      },
    });

    if (!attendance) {
      throw new Error("ATTENDANCE_NOT_FOUND");
    }

    // Role authorization check
    if (requestingRole === "EMPLOYEE") {
      if (attendance.employeeId !== requestingEmployeeId) {
        throw new Error("FORBIDDEN");
      }
    } else if (requestingRole === "MANAGER") {
      if (attendance.employee.departmentId !== requestingDepartmentId && attendance.employeeId !== requestingEmployeeId) {
        throw new Error("FORBIDDEN");
      }
    }

    return attendance;
  }

  /**
   * Retrieves admin aggregate attendance summary for a given date.
   */
  static async getAdminAttendanceSummary(dateInput?: Date | string, filters: { departmentId?: string } = {}) {
    const startOfDay = getStartOfDay(dateInput);
    const endOfDay = getEndOfDay(dateInput);

    const empWhere: any = { status: "ACTIVE", role: { name: { not: "ADMIN" } } };
    if (filters.departmentId) {
      empWhere.departmentId = filters.departmentId;
    }

    const totalActiveEmployees = await prisma.employee.count({ where: empWhere });

    const attWhere: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      employee: { role: { name: { not: "ADMIN" } } },
    };
    if (filters.departmentId) {
      attWhere.employee.departmentId = filters.departmentId;
    }

    const attendances = await prisma.attendance.findMany({
      where: attWhere,
      include: {
        sessions: {
          include: {
            breaks: true,
          },
        },
      },
    });

    let present = 0;
    let working = 0;
    let onBreak = 0;
    let completed = 0;

    attendances.forEach((att) => {
      present++;
      const activeSession = att.sessions.find((s) => !s.punchOut);
      const activeBreak = activeSession?.breaks.find((b) => !b.endTime);

      if (activeBreak) {
        onBreak++;
      } else if (activeSession) {
        working++;
      } else if (att.sessions.length > 0) {
        completed++;
      }
    });

    const absent = Math.max(0, totalActiveEmployees - present);

    return {
      date: getKolkataDateString(dateInput),
      totalEmployees: totalActiveEmployees,
      present,
      absent,
      working,
      onBreak,
      completed,
    };
  }

  /**
   * Retrieves live attendance state grid for all active employees.
   */
  static async getLiveAttendanceStates(filters: { departmentId?: string; status?: string; date?: string } = {}) {
    const now = new Date();
    const targetDate = filters.date ? new Date(filters.date) : now;
    const startOfDay = getStartOfDay(targetDate);
    const endOfDay = getEndOfDay(targetDate);

    const empWhere: any = { status: "ACTIVE", role: { name: { not: "ADMIN" } } };
    if (filters.departmentId) {
      empWhere.departmentId = filters.departmentId;
    }

    const employees = await prisma.employee.findMany({
      where: empWhere,
      include: {
        department: true,
        role: true,
        attendances: {
          where: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          include: {
            sessions: {
              orderBy: { createdAt: "asc" },
              include: {
                breaks: {
                  orderBy: { createdAt: "asc" },
                  include: { breakType: true },
                },
              },
            },
          },
        },
      },
      orderBy: { fullName: "asc" },
    });

    const states = employees.map((emp) => {
      const todayAttendance = emp.attendances[0] || null;
      const sessions = todayAttendance?.sessions || [];
      const activeSession = sessions.find((s) => !s.punchOut);
      const activeBreak = activeSession?.breaks.find((b) => !b.endTime);

      let currentState: "ABSENT" | "WORKING" | "ON_BREAK" | "COMPLETED" = "ABSENT";
      if (activeBreak) {
        currentState = "ON_BREAK";
      } else if (activeSession) {
        currentState = "WORKING";
      } else if (sessions.length > 0) {
        currentState = "COMPLETED";
      }

      const firstPunchIn = sessions[0]?.punchIn || null;
      const currentSessionDuration = activeSession ? calculateDurationSeconds(activeSession.punchIn, now) : 0;
      const currentBreakDuration = activeBreak ? calculateDurationSeconds(activeBreak.startTime, now) : 0;

      const breakHistory = sessions.flatMap(s => s.breaks).map(b => ({
        breakTypeName: b.breakType?.name || "Break",
        purpose: b.purpose || null,
        startTime: b.startTime,
        endTime: b.endTime,
        durationSeconds: b.endTime ? b.durationSeconds : calculateDurationSeconds(b.startTime, now)
      }));

      let declaredBreakSeconds = 0;
      let idleBreakSeconds = 0;
      breakHistory.forEach(b => {
        if (b.breakTypeName === "System Idle" || b.breakTypeName === "Idle Break") {
          idleBreakSeconds += b.durationSeconds;
        } else {
          declaredBreakSeconds += b.durationSeconds;
        }
      });
      const totalBreakSeconds = declaredBreakSeconds + idleBreakSeconds;

      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        avatar: emp.avatar,
        designation: emp.designation,
        department: emp.department?.name || null,
        currentState,
        punchIn: firstPunchIn,
        activeSessionStart: activeSession?.punchIn || null,
        currentSessionDuration,
        activeBreakStart: activeBreak?.startTime || null,
        activeBreakTypeName: activeBreak?.breakType?.name || null,
        currentBreakDuration,
        totalWorkingSeconds: todayAttendance?.totalWorkingSeconds || 0,
        netWorkingSeconds: todayAttendance?.netWorkingSeconds || 0,
        totalBreakSeconds,
        declaredBreakSeconds,
        idleBreakSeconds,
        shortfallMinutes: todayAttendance?.shortfallMinutes || 0,
        overtimeMinutes: todayAttendance?.overtimeMinutes || 0,
        earlyLogoutMinutes: todayAttendance?.earlyLogoutMinutes || 0,
        breakHistory,
      };
    });

    if (filters.status && filters.status !== "ALL") {
      return states.filter((s) => s.currentState === filters.status);
    }

    return states;
  }
}
