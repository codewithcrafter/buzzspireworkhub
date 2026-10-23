import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getStartOfDay, getEndOfDay, calculateDurationSeconds, getKolkataDateString, calculateLateStatus } from "@/lib/date";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";
import { HREngineService } from "./hr-engine.service";
import { SettingsService } from "./settings.service";

export class AttendanceService {
  /**
   * Retrieves today's attendance record along with sessions, breaks, and current status for an employee.
   */
  static async getTodayAttendance(employeeId: string, dateInput?: Date | string) {
    const startOfDay = getStartOfDay(dateInput);
    const endOfDay = getEndOfDay(dateInput);

    // Auto-close any orphaned sessions from previous days and stale active breaks if checking today
    if (!dateInput) {
      await AttendanceService.autoCloseOrphanedSessions(prisma, employeeId, startOfDay).catch((err) => {
        console.error("Auto-close orphaned sessions error in getTodayAttendance:", err);
      });
      await AttendanceService.autoCloseStaleBreaks(prisma, employeeId).catch((err) => {
        console.error("Auto-close stale breaks error in getTodayAttendance:", err);
      });
    }

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
      const maxBreakCapSeconds = 180 * 60; // 3 hours cap
      const currentBreakElapsed = Math.min(
        maxBreakCapSeconds,
        calculateDurationSeconds(activeBreak.startTime, now)
      );
      const closedBreaksSum = attendance.sessions.flatMap((s) => s.breaks)
        .filter((b) => b.endTime && b.id !== activeBreak.id)
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
            durationSeconds: Math.min(
              180 * 60,
              calculateDurationSeconds(activeBreak.startTime, now)
            ),
          }
        : null,
      sessions: attendance.sessions,
    };
  }

  /**
   * Automatically closes unclosed / hanging sessions from previous calendar days.
   * Prevents employees from being permanently locked out of punching in on subsequent days.
   */
  static async autoCloseOrphanedSessions(
    tx: Prisma.TransactionClient | typeof prisma,
    employeeId: string,
    currentStartOfDay: Date,
    shiftEndConfig?: string | null
  ): Promise<number> {
    const orphanedSessions = await tx.attendanceSession.findMany({
      where: {
        employeeId,
        punchOut: null,
        punchIn: { lt: currentStartOfDay },
      },
      include: {
        attendance: true,
        breaks: {
          where: { endTime: null },
        },
      },
      orderBy: { punchIn: "asc" },
    });

    for (const session of orphanedSessions) {
      const sessionDayStart = getStartOfDay(session.punchIn);
      const sessionDayEnd = getEndOfDay(session.punchIn);

      // 1. Auto-close any hanging breaks on this orphaned session
      for (const openBreak of session.breaks) {
        const autoBreakEnd = new Date(
          Math.min(
            openBreak.startTime.getTime() + 60 * 60 * 1000,
            sessionDayEnd.getTime()
          )
        );
        const breakDuration = calculateDurationSeconds(openBreak.startTime, autoBreakEnd);
        await tx.break.update({
          where: { id: openBreak.id },
          data: {
            endTime: autoBreakEnd,
            durationSeconds: breakDuration,
          },
        });
      }

      // 2. Determine an appropriate auto-close time for the session
      let autoCheckoutTime: Date;
      if (shiftEndConfig && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(shiftEndConfig)) {
        const [endH, endM] = shiftEndConfig.split(":").map(Number);
        const shiftEndDate = new Date(sessionDayStart.getTime() + (endH * 60 + endM) * 60 * 1000);
        if (shiftEndDate > session.punchIn) {
          autoCheckoutTime = shiftEndDate;
        } else {
          autoCheckoutTime = new Date(session.punchIn.getTime() + 8 * 3600 * 1000);
        }
      } else {
        autoCheckoutTime = new Date(session.punchIn.getTime() + 8 * 3600 * 1000);
      }

      // Cap at end of that day (23:59:59 IST)
      if (autoCheckoutTime > sessionDayEnd) {
        autoCheckoutTime = sessionDayEnd;
      }

      const sessionWorkingSeconds = calculateDurationSeconds(session.punchIn, autoCheckoutTime);

      await tx.attendanceSession.update({
        where: { id: session.id },
        data: {
          punchOut: autoCheckoutTime,
          workingSeconds: sessionWorkingSeconds,
        },
      });

      // 3. Recalculate parent attendance container
      const allSessions = await tx.attendanceSession.findMany({
        where: { attendanceId: session.attendanceId },
        include: { breaks: true },
      });

      const totalWorking = allSessions.reduce((sum: number, s) => sum + (s.workingSeconds || 0), 0);
      const totalBreaks = allSessions
        .flatMap((s) => s.breaks)
        .reduce((sum: number, b) => sum + (b.durationSeconds || 0), 0);
      const netWorking = Math.max(0, totalWorking - totalBreaks);

      await tx.attendance.update({
        where: { id: session.attendanceId },
        data: {
          checkOut: autoCheckoutTime,
          totalWorkingSeconds: totalWorking,
          totalBreakSeconds: totalBreaks,
          netWorkingSeconds: netWorking,
        },
      });

      // 4. Audit & Activity logging via Enterprise Audit Service
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "ATTENDANCE_AUTO_CLOSED",
          module: "ATTENDANCE",
          description: `Overnight unclosed shift from ${sessionDayStart.toLocaleDateString("en-IN")} was auto-closed.`,
          metadata: {
            sessionId: session.id,
            attendanceId: session.attendanceId,
            autoCheckoutTime,
            sessionWorkingSeconds,
          },
        },
      });

      await AuditService.logEvent(
        {
          employeeId,
          performedById: null, // System automated agent
          action: "ATTENDANCE_AUTO_CLOSED",
          module: "ATTENDANCE",
          description: `System auto-remediation: auto-closed orphaned shift from ${sessionDayStart.toLocaleDateString("en-IN")}`,
          metadata: {
            systemRemediation: true,
            sessionId: session.id,
            attendanceId: session.attendanceId,
            before: {
              punchOut: null,
            },
            after: {
              punchOut: autoCheckoutTime,
              workingSeconds: sessionWorkingSeconds,
            },
            autoCheckoutTime,
            sessionWorkingSeconds,
            reason: "Hanging overnight shift auto-closed by attendance engine",
          },
        },
        tx
      );
    }

    // Also auto-close any hanging breaks from previous days that were orphaned across any session
    const orphanedPastBreaks = await tx.break.findMany({
      where: {
        endTime: null,
        startTime: { lt: currentStartOfDay },
        attendanceSession: { employeeId },
      },
    });

    for (const ob of orphanedPastBreaks) {
      const bDayEnd = getEndOfDay(ob.startTime);
      const autoEnd = new Date(Math.min(ob.startTime.getTime() + 60 * 60 * 1000, bDayEnd.getTime()));
      const dur = calculateDurationSeconds(ob.startTime, autoEnd);
      await tx.break.update({
        where: { id: ob.id },
        data: {
          endTime: autoEnd,
          durationSeconds: dur,
        },
      });
    }

    return orphanedSessions.length;
  }

  /**
   * Automatically closes active breaks exceeding safety duration limit (default 180 min / 3 hours).
   * Prevents break timers from running indefinitely if forgotten or abandoned.
   */
  static async autoCloseStaleBreaks(
    tx: Prisma.TransactionClient | typeof prisma,
    employeeId: string,
    maxDurationMinutes: number = 180
  ): Promise<number> {
    const now = new Date();
    const maxDurationSeconds = maxDurationMinutes * 60;

    const staleBreaks = await tx.break.findMany({
      where: {
        endTime: null,
        attendanceSession: { employeeId },
      },
      include: {
        attendanceSession: true,
        breakType: true,
      },
    });

    let closedCount = 0;
    for (const brk of staleBreaks) {
      const elapsed = calculateDurationSeconds(brk.startTime, now);
      if (elapsed >= maxDurationSeconds) {
        const cappedEnd = new Date(brk.startTime.getTime() + maxDurationSeconds * 1000);
        await tx.break.update({
          where: { id: brk.id },
          data: {
            endTime: cappedEnd,
            durationSeconds: maxDurationSeconds,
          },
        });
        closedCount++;

        // Update attendance container
        const allSessions = await tx.attendanceSession.findMany({
          where: { attendanceId: brk.attendanceSession.attendanceId },
          include: { breaks: true },
        });

        const totalBreaks = allSessions
          .flatMap((s) => s.breaks)
          .reduce((sum, b) => sum + (b.id === brk.id ? maxDurationSeconds : b.durationSeconds || 0), 0);

        const att = await tx.attendance.findUnique({
          where: { id: brk.attendanceSession.attendanceId },
          select: { totalWorkingSeconds: true },
        });

        await tx.attendance.update({
          where: { id: brk.attendanceSession.attendanceId },
          data: {
            totalBreakSeconds: totalBreaks,
            netWorkingSeconds: Math.max(0, (att?.totalWorkingSeconds || 0) - totalBreaks),
          },
        });

        await tx.activityLog.create({
          data: {
            employeeId,
            action: "BREAK_AUTO_CLOSED",
            module: "ATTENDANCE",
            description: `Active break (${brk.breakType?.name || "Break"}) automatically closed after exceeding maximum duration cap (${maxDurationMinutes}m)`,
            metadata: { breakId: brk.id, maxDurationSeconds },
          },
        });
      }
    }

    return closedCount;
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
        select: {
          id: true,
          status: true,
          shiftStart: true,
          shiftEnd: true,
          lastWorkingDate: true,
          role: { select: { name: true } },
        },
      });

      if (!employee || employee.status === "EXITED" || employee.status === "TERMINATED") {
        throw new Error("EMPLOYMENT_ENDED");
      }
      if (employee.status === "INACTIVE" || employee.status === "SUSPENDED") {
        throw new Error("EMPLOYEE_NOT_ACTIVE");
      }
      if (employee.lastWorkingDate && getStartOfDay(now) > getStartOfDay(employee.lastWorkingDate)) {
        throw new Error("BEYOND_LAST_WORKING_DATE");
      }

      if (employee.role.name === "ADMIN") {
        throw new Error("ADMIN_ATTENDANCE_NOT_ALLOWED");
      }

      // 2. Clean up any hanging / orphaned sessions from PREVIOUS DAYS
      await AttendanceService.autoCloseOrphanedSessions(tx, employeeId, startOfDay, employee.shiftEnd);

      // 3. Check existing open session for employee TODAY
      const existingTodayOpenSession = await tx.attendanceSession.findFirst({
        where: {
          employeeId,
          punchOut: null,
          punchIn: { gte: startOfDay, lte: endOfDay },
        },
      });

      if (existingTodayOpenSession) {
        throw new Error("ALREADY_PUNCHED_IN");
      }

      // 4. Find or create today's Attendance container record
      let attendance = await tx.attendance.findFirst({
        where: {
          employeeId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const officeStart = (await SettingsService.get("office_start_time")) || employee.shiftStart || "10:00";
      const lateGrace = parseInt((await SettingsService.get("late_grace_minutes")) || "15", 10);
      const lateCalc = calculateLateStatus(now, officeStart, lateGrace);

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

      // 5. Create new AttendanceSession
      const session = await tx.attendanceSession.create({
        data: {
          attendanceId: attendance.id,
          employeeId,
          punchIn: now,
          workingSeconds: 0,
        },
      });

      // 6. Create Activity & Audit records
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
        orderBy: { punchIn: "desc" },
      });

      if (!activeSession) {
        throw new Error("NO_ACTIVE_SESSION");
      }

      // 2. Gracefully auto-close any active breaks instead of throwing error!
      const activeBreaks = await tx.break.findMany({
        where: {
          endTime: null,
          attendanceSession: { employeeId },
        },
      });

      let closedBreakDuration = 0;
      for (const ab of activeBreaks) {
        const dur = calculateDurationSeconds(ab.startTime, now);
        await tx.break.update({
          where: { id: ab.id },
          data: {
            endTime: now,
            durationSeconds: dur,
          },
        });
        closedBreakDuration += dur;

        await tx.activityLog.create({
          data: {
            employeeId,
            action: "BREAK_ENDED",
            module: "ATTENDANCE",
            description: `Active break automatically ended on shift punch out (${dur}s)`,
            metadata: { breakId: ab.id, autoClosedOnPunchOut: true },
          },
        });
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

      // 6. Audit & Activity
      const hadAutoClosedBreaks = activeBreaks.length > 0;
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "PUNCH_OUT",
          module: "ATTENDANCE",
          description: `Punched out at ${now.toLocaleTimeString("en-IN")}${hadAutoClosedBreaks ? ` (${activeBreaks.length} active break(s) ended automatically)` : ""}`,
          metadata: { sessionId: activeSession.id, sessionWorkingSeconds, autoClosedBreak: hadAutoClosedBreaks },
        },
      });

      await tx.auditLog.create({
        data: {
          employeeId,
          action: "ATTENDANCE_PUNCH_OUT",
          module: "ATTENDANCE",
          description: `Punch out recorded. Session duration: ${sessionWorkingSeconds}s${hadAutoClosedBreaks ? ` (${activeBreaks.length} auto-closed active break(s))` : ""}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: { sessionId: activeSession.id, sessionWorkingSeconds, autoClosedBreak: hadAutoClosedBreaks },
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
        orderBy: { punchIn: "desc" },
        include: {
          breaks: true,
        },
      });

      if (!activeSession) {
        throw new Error("NO_ACTIVE_SESSION");
      }

      // 2. Check for active breaks and auto-close any stale breaks exceeding max threshold
      const existingActiveBreaks = await tx.break.findMany({
        where: {
          endTime: null,
          attendanceSession: { employeeId },
        },
      });

      const maxBreakSeconds = 180 * 60;
      let unclosedCount = 0;
      for (const eb of existingActiveBreaks) {
        const elapsed = calculateDurationSeconds(eb.startTime, now);
        if (elapsed >= maxBreakSeconds) {
          // Stale break -> auto-close so employee is not locked out
          await tx.break.update({
            where: { id: eb.id },
            data: {
              endTime: new Date(eb.startTime.getTime() + maxBreakSeconds * 1000),
              durationSeconds: maxBreakSeconds,
            },
          });
        } else {
          unclosedCount++;
        }
      }

      if (unclosedCount > 0) {
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
   * Ends active break(s) for an employee (atomic transaction).
   * Robust against session ordering issues, multiple open breaks, and stale timers.
   */
  static async endBreak(employeeId: string, ipAddress?: string, userAgent?: string) {
    const now = new Date();

    return prisma.$transaction(async (tx) => {
      // 1. Authoritative lookup: Find ALL active breaks for this employee directly
      const activeBreaks = await tx.break.findMany({
        where: {
          endTime: null,
          attendanceSession: {
            employeeId,
          },
        },
        include: {
          breakType: true,
          attendanceSession: {
            include: { attendance: true },
          },
        },
        orderBy: { startTime: "desc" },
      });

      if (activeBreaks.length === 0) {
        throw new Error("NO_ACTIVE_BREAK");
      }

      // 2. Fetch maximum allowable break duration (default: 180 mins / 3 hours)
      let maxBreakMinutes = 180;
      try {
        const maxSetting = await tx.systemSetting.findUnique({
          where: { key: "MAX_BREAK_DURATION_MINUTES" },
        });
        if (maxSetting?.value && !isNaN(parseInt(maxSetting.value, 10))) {
          maxBreakMinutes = parseInt(maxSetting.value, 10);
        }
      } catch {
        // Fallback default 180
      }
      const maxBreakSeconds = maxBreakMinutes * 60;

      // 3. Close all active breaks for this employee to prevent stuck/hanging timers
      const primaryBreak = activeBreaks[0];
      const affectedAttendanceIds = new Set<string>();
      let primaryDurationSeconds = 0;
      let primaryEndTime = now;

      for (let i = 0; i < activeBreaks.length; i++) {
        const brk = activeBreaks[i];
        affectedAttendanceIds.add(brk.attendanceSession.attendanceId);

        let durationSeconds = calculateDurationSeconds(brk.startTime, now);
        let effectiveEndTime = now;

        // Auto-cap safety fallback: If break ran longer than max allowed duration
        if (durationSeconds > maxBreakSeconds) {
          durationSeconds = maxBreakSeconds;
          effectiveEndTime = new Date(brk.startTime.getTime() + maxBreakSeconds * 1000);
        }

        await tx.break.update({
          where: { id: brk.id },
          data: {
            endTime: effectiveEndTime,
            durationSeconds,
          },
        });

        if (i === 0) {
          primaryDurationSeconds = durationSeconds;
          primaryEndTime = effectiveEndTime;
        }
      }

      // 4. Update parent attendance container totals (totalBreakSeconds & netWorkingSeconds)
      let primaryTotalBreaks = 0;
      for (const attId of affectedAttendanceIds) {
        const allAttendanceSessions = await tx.attendanceSession.findMany({
          where: { attendanceId: attId },
          include: { breaks: true },
        });

        const totalBreaks = allAttendanceSessions
          .flatMap((s) => s.breaks)
          .reduce((sum, b) => sum + (b.durationSeconds || 0), 0);

        const idleBreaks = allAttendanceSessions
          .flatMap((s) => s.breaks)
          .filter((b) => b.purpose?.toLowerCase().includes("idle"))
          .reduce((sum, b) => sum + (b.durationSeconds || 0), 0);

        const attRecord = await tx.attendance.findUnique({
          where: { id: attId },
          select: { totalWorkingSeconds: true },
        });

        const netWorking = Math.max(0, (attRecord?.totalWorkingSeconds || 0) - totalBreaks);

        await tx.attendance.update({
          where: { id: attId },
          data: {
            totalBreakSeconds: totalBreaks,
            netWorkingSeconds: netWorking,
            idleSeconds: idleBreaks,
          },
        });

        if (attId === primaryBreak.attendanceSession.attendanceId) {
          primaryTotalBreaks = totalBreaks;
        }
      }

      // 5. Activity & Audit Logs
      await tx.activityLog.create({
        data: {
          employeeId,
          action: "BREAK_ENDED",
          module: "ATTENDANCE",
          description: `Ended break: ${primaryBreak.breakType?.name || "Break"} (${primaryDurationSeconds}s)`,
          metadata: {
            breakId: primaryBreak.id,
            breakDurationSeconds: primaryDurationSeconds,
            closedBreaksCount: activeBreaks.length,
          },
        },
      });

      await tx.auditLog.create({
        data: {
          employeeId,
          action: "BREAK_ENDED",
          module: "ATTENDANCE",
          description: `Break ended (${primaryDurationSeconds}s duration)${activeBreaks.length > 1 ? ` [${activeBreaks.length} breaks closed]` : ""}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: {
            breakId: primaryBreak.id,
            breakDurationSeconds: primaryDurationSeconds,
            closedBreaksCount: activeBreaks.length,
          },
        },
      });

      return {
        id: primaryBreak.id,
        endTime: primaryEndTime,
        durationSeconds: primaryDurationSeconds,
        totalBreakSeconds: primaryTotalBreaks,
      };
    });
  }

  /**
   * Forcefully ends active break session(s) for an employee (Admin / HR action).
   * Automatically enforces safety duration cap, updates parent attendance totals, and logs audit trail.
   */
  static async adminForceEndBreak(options: {
    employeeId: string;
    adminId: string;
    breakId?: string;
    endTime?: Date;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { employeeId, adminId, breakId, reason = "Force-ended by Administrator", ipAddress, userAgent } = options;
    const now = options.endTime || new Date();

    return prisma.$transaction(async (tx) => {
      // 1. Authoritative lookup: Find active break(s) matching criteria
      const whereClause: any = {
        endTime: null,
        attendanceSession: { employeeId },
      };
      if (breakId) {
        whereClause.id = breakId;
      }

      const activeBreaks = await tx.break.findMany({
        where: whereClause,
        include: {
          breakType: true,
          attendanceSession: {
            include: { attendance: true },
          },
        },
        orderBy: { startTime: "desc" },
      });

      if (activeBreaks.length === 0) {
        throw new Error("NO_ACTIVE_BREAK");
      }

      // 2. Fetch maximum allowable duration (default: 180 min)
      let maxBreakMinutes = 180;
      try {
        const maxSetting = await tx.systemSetting.findUnique({
          where: { key: "MAX_BREAK_DURATION_MINUTES" },
        });
        if (maxSetting?.value && !isNaN(parseInt(maxSetting.value, 10))) {
          maxBreakMinutes = parseInt(maxSetting.value, 10);
        }
      } catch {
        // Fallback default 180
      }
      const maxBreakSeconds = maxBreakMinutes * 60;

      const closedBreaks = [];
      const affectedAttendanceIds = new Set<string>();

      for (const ab of activeBreaks) {
        let calculatedDuration = calculateDurationSeconds(ab.startTime, now);
        let actualEndTime = now;

        if (calculatedDuration > maxBreakSeconds) {
          calculatedDuration = maxBreakSeconds;
          actualEndTime = new Date(ab.startTime.getTime() + maxBreakSeconds * 1000);
        }

        const updatedBreak = await tx.break.update({
          where: { id: ab.id },
          data: {
            endTime: actualEndTime,
            durationSeconds: calculatedDuration,
          },
          include: { breakType: true },
        });

        closedBreaks.push(updatedBreak);
        if (ab.attendanceSession?.attendanceId) {
          affectedAttendanceIds.add(ab.attendanceSession.attendanceId);
        }
      }

      // 3. Recalculate parent attendance containers
      for (const attId of affectedAttendanceIds) {
        const allSessionsWithBreaks = await tx.attendanceSession.findMany({
          where: { attendanceId: attId },
          include: { breaks: true },
        });

        const totalWorking = allSessionsWithBreaks.reduce(
          (sum, s) => sum + (s.workingSeconds || 0),
          0
        );

        const totalBreaks = allSessionsWithBreaks
          .flatMap((s) => s.breaks)
          .reduce((sum, b) => sum + (b.durationSeconds || 0), 0);

        const netWorking = Math.max(0, totalWorking - totalBreaks);

        await tx.attendance.update({
          where: { id: attId },
          data: {
            totalBreakSeconds: totalBreaks,
            netWorkingSeconds: netWorking,
          },
        });
      }

      // 4. Audit & Activity Logging
      const primaryBreak = closedBreaks[0];
      await AuditService.logEvent(
        {
          employeeId,
          performedById: adminId,
          action: "ATTENDANCE_BREAK_FORCE_ENDED",
          module: "ATTENDANCE",
          description: `Admin forcefully ended break (${primaryBreak.breakType?.name || "Break"}) [${primaryBreak.durationSeconds}s]. Reason: ${reason}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: {
            adminId,
            breakId: primaryBreak.id,
            breakTypeName: primaryBreak.breakType?.name,
            durationSeconds: primaryBreak.durationSeconds,
            closedBreaksCount: closedBreaks.length,
            reason,
          },
        },
        tx
      );

      await tx.activityLog.create({
        data: {
          employeeId,
          action: "BREAK_FORCE_ENDED",
          module: "ATTENDANCE",
          description: `Break (${primaryBreak.breakType?.name || "Break"}) forcefully ended by administrator. Reason: ${reason}`,
          metadata: {
            adminId,
            breakId: primaryBreak.id,
            durationSeconds: primaryBreak.durationSeconds,
            reason,
          },
        },
      });

      return {
        closedBreaks,
        primaryBreak,
        closedCount: closedBreaks.length,
      };
    });
  }

  /**
   * Resumes an accidentally ended shift for an employee (Admin-only).
   */
  static async resumeShift(
    attendanceId: string,
    adminId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Find the attendance record and its sessions
      const attendance = await tx.attendance.findUnique({
        where: { id: attendanceId },
        include: { sessions: { orderBy: { createdAt: "asc" } } },
      });

      if (!attendance) {
        throw new Error("ATTENDANCE_NOT_FOUND");
      }

      // 2. Prevent resuming if already active
      const activeSession = attendance.sessions.find(s => !s.punchOut);
      if (activeSession) {
        throw new Error("SHIFT_ALREADY_ACTIVE");
      }

      // 3. Prevent resuming if there are no sessions
      if (attendance.sessions.length === 0) {
        throw new Error("NO_PUNCH_IN_FOUND");
      }

      // 4. Find the last session
      const lastSession = attendance.sessions[attendance.sessions.length - 1];
      const previousCheckOut = lastSession.punchOut;
      const originalCheckIn = lastSession.punchIn;

      // 5. Re-open the last session by nullifying punchOut
      await tx.attendanceSession.update({
        where: { id: lastSession.id },
        data: {
          punchOut: null,
        },
      });

      // 6. Recalculate working and break seconds for the previously closed sessions
      const allOtherSessions = attendance.sessions.filter(s => s.id !== lastSession.id);
      const closedSessionsSum = allOtherSessions.reduce((sum, s) => sum + (s.workingSeconds || 0), 0);

      const allSessionsWithBreaks = await tx.attendanceSession.findMany({
        where: { attendanceId: attendance.id },
        include: { breaks: true },
      });

      const totalBreaks = allSessionsWithBreaks
        .flatMap((s) => s.breaks)
        .reduce((sum, b) => sum + (b.durationSeconds || 0), 0);

      const netWorking = Math.max(0, closedSessionsSum - totalBreaks);

      // 7. Update the parent attendance container
      await tx.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOut: null,
          totalWorkingSeconds: closedSessionsSum,
          totalBreakSeconds: totalBreaks,
          netWorkingSeconds: netWorking,
        },
      });

      // 8. Audit Log (Required)
      await tx.auditLog.create({
        data: {
          employeeId: attendance.employeeId,
          action: "ATTENDANCE_SHIFT_RESUMED",
          module: "ATTENDANCE",
          description: `Admin resumed shift. Reason: ${reason}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: {
            attendanceId,
            sessionId: lastSession.id,
            previousCheckOut,
            originalCheckIn,
            reason,
            adminId,
          },
        },
      });

      return attendance;
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
  static async adminManualPunchIn(
    employeeId: string,
    adminId: string,
    dateString: string,
    timeString: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const punchDate = new Date(`${dateString}T${timeString}:00+05:30`);
    if (isNaN(punchDate.getTime())) throw new Error("INVALID_PUNCH_TIME");
    
    if (punchDate > new Date()) throw new Error("FUTURE_TIMESTAMP_NOT_ALLOWED");

    const startOfDay = getStartOfDay(punchDate);
    const endOfDay = getEndOfDay(punchDate);

    return prisma.$transaction(async (tx) => {
      // Check employee
      const employee = await tx.employee.findUnique({ where: { id: employeeId }, include: { role: true } });
      if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
      if (employee.role.name === "ADMIN") throw new Error("ADMIN_ATTENDANCE_NOT_ALLOWED");

      let attendance = await tx.attendance.findFirst({
        where: { employeeId, date: { gte: startOfDay, lte: endOfDay } },
        include: { sessions: true },
      });

      if (attendance) {
        const activeSession = attendance.sessions.find(s => !s.punchOut);
        if (activeSession) throw new Error("ATTENDANCE_ALREADY_ACTIVE");
        if (attendance.sessions.length > 0) throw new Error("ATTENDANCE_ALREADY_COMPLETED");
      }

      const officeStart = (await SettingsService.get("office_start_time")) || employee.shiftStart || "10:00";
      const lateGrace = parseInt((await SettingsService.get("late_grace_minutes")) || "15", 10);
      const lateCalc = calculateLateStatus(punchDate, officeStart, lateGrace);

      if (!attendance) {
        attendance = await tx.attendance.create({
          data: {
            employeeId,
            date: startOfDay,
            checkIn: punchDate,
            status: lateCalc.isLate ? "LATE" : "PRESENT",
            isLate: lateCalc.isLate,
            lateMinutes: lateCalc.lateMinutes,
            totalWorkingSeconds: 0,
            totalBreakSeconds: 0,
            netWorkingSeconds: 0,
          },
          include: { sessions: true },
        });
      }

      const session = await tx.attendanceSession.create({
        data: {
          attendanceId: attendance.id,
          employeeId,
          punchIn: punchDate,
          workingSeconds: 0,
        },
      });

      // Audit Log via Enterprise Audit Service
      await AuditService.logEvent(
        {
          employeeId,
          performedById: adminId,
          action: "ATTENDANCE_MANUAL_ADJUST",
          module: "ATTENDANCE",
          description: `Admin manual punch in. Reason: ${reason}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: {
            operation: "MANUAL_PUNCH_IN",
            adminId,
            sessionId: session.id,
            attendanceId: attendance.id,
            reason,
            before: {
              checkIn: attendance.checkIn || null,
              checkOut: attendance.checkOut || null,
            },
            after: {
              checkIn: punchDate,
              checkOut: attendance.checkOut || null,
            },
            selectedBusinessDate: dateString,
          },
        },
        tx
      );

      return session;
    });
  }

  /**
   * Admin Manual / Force Punch Out
   */
  static async adminManualPunchOut(
    employeeId: string,
    adminId: string,
    dateString: string,
    timeString: string,
    reason: string,
    isForce: boolean,
    ipAddress?: string,
    userAgent?: string
  ) {
    const punchDate = new Date(`${dateString}T${timeString}:00+05:30`);
    if (isNaN(punchDate.getTime())) throw new Error("INVALID_PUNCH_TIME");
    
    if (punchDate > new Date()) throw new Error("FUTURE_TIMESTAMP_NOT_ALLOWED");

    const startOfDay = getStartOfDay(punchDate);
    const endOfDay = getEndOfDay(punchDate);

    const result = await prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.findFirst({
        where: { employeeId, date: { gte: startOfDay, lte: endOfDay } },
        include: { sessions: { include: { breaks: true } } },
      });

      if (!attendance) throw new Error("NO_PUNCH_IN_FOUND");

      const activeSession = attendance.sessions.find(s => !s.punchOut);

      let targetSession = activeSession;
      if (!targetSession) {
        throw new Error("ATTENDANCE_ALREADY_COMPLETED");
      }

      if (punchDate < targetSession.punchIn) {
        throw new Error("PUNCH_OUT_BEFORE_PUNCH_IN");
      }

      // Handle breaks
      const activeBreak = targetSession.breaks.find((b) => !b.endTime);
      if (activeBreak) {
        if (punchDate < activeBreak.startTime) {
           throw new Error("PUNCH_OUT_BEFORE_BREAK_START");
        }
        await tx.break.update({
          where: { id: activeBreak.id },
          data: {
            endTime: punchDate,
            durationSeconds: calculateDurationSeconds(activeBreak.startTime, punchDate),
          }
        });
      }

      const sessionWorkingSeconds = calculateDurationSeconds(targetSession.punchIn, punchDate);

      await tx.attendanceSession.update({
        where: { id: targetSession.id },
        data: {
          punchOut: punchDate,
          workingSeconds: sessionWorkingSeconds,
        },
      });

      // Recalculate attendance
      const allSessionsWithBreaks = await tx.attendanceSession.findMany({
        where: { attendanceId: attendance.id },
        include: { breaks: true },
      });

      const totalWorking = allSessionsWithBreaks.reduce(
        (sum, s) => sum + (s.id === targetSession.id ? sessionWorkingSeconds : s.workingSeconds || 0),
        0
      );
      const totalBreaks = allSessionsWithBreaks
        .flatMap((s) => s.breaks)
        .reduce((sum, b) => {
           if (b.id === activeBreak?.id) {
             return sum + calculateDurationSeconds(b.startTime, punchDate);
           }
           return sum + (b.durationSeconds || 0);
        }, 0);

      const netWorking = Math.max(0, totalWorking - totalBreaks);

      await tx.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOut: punchDate,
          totalWorkingSeconds: totalWorking,
          totalBreakSeconds: totalBreaks,
          netWorkingSeconds: netWorking,
        },
      });

      const action = isForce ? "ATTENDANCE_FORCE_ADJUST" : "ATTENDANCE_MANUAL_ADJUST";

      await AuditService.logEvent(
        {
          employeeId,
          performedById: adminId,
          action,
          module: "ATTENDANCE",
          description: `Admin ${isForce ? "force" : "manual"} punch out. Reason: ${reason}`,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          metadata: {
            operation: isForce ? "FORCE_PUNCH_OUT" : "MANUAL_PUNCH_OUT",
            adminId,
            sessionId: targetSession.id,
            attendanceId: attendance.id,
            reason,
            before: {
              checkIn: attendance.checkIn || null,
              checkOut: attendance.checkOut || null,
            },
            after: {
              checkIn: attendance.checkIn || null,
              checkOut: punchDate,
            },
            selectedBusinessDate: dateString,
          },
        },
        tx
      );

      return attendance;
    });

    await HREngineService.recalculateAttendance(result.id).catch((e) => {
      console.error("Failed to run HR Engine after admin punchOut", e);
    });

    return result;
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
  /**
   * Retrieves admin aggregate attendance summary for a given date.
   */
  static async getAdminAttendanceSummary(dateInput?: Date | string, filters: { departmentId?: string } = {}) {
    const startOfDay = getStartOfDay(dateInput);
    const endOfDay = getEndOfDay(dateInput);

    const activeStatuses: Prisma.EnumEmployeeStatusFilter = {
      in: ["ACTIVE", "PROBATION", "CONFIRMED", "NOTICE_PERIOD", "ONBOARDING"] as any,
    };

    const empWhere: any = {
      status: activeStatuses,
      role: { name: { not: "ADMIN" } },
    };
    if (filters.departmentId) {
      empWhere.departmentId = filters.departmentId;
    }

    const totalActiveEmployees = await prisma.employee.count({ where: empWhere });

    const attWhere: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      employee: {
        status: activeStatuses,
        role: { name: { not: "ADMIN" } },
      },
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
    let late = 0;
    let onLeave = 0;
    let halfDay = 0;
    let working = 0;
    let onBreak = 0;
    let completed = 0;

    attendances.forEach((att) => {
      if (att.status === "PRESENT") present++;
      if (att.status === "LATE") late++;
      if (att.status === "ON_LEAVE") onLeave++;
      if (att.status === "HALF_DAY") halfDay++;

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

    // Check approved OD requests on this date (safely handled if table does not exist)
    let approvedODs: Array<{ employeeId: string }> = [];
    try {
      approvedODs = await (prisma as any).onDutyRequest.findMany({
        where: {
          status: "APPROVED",
          date: { gte: startOfDay, lte: endOfDay },
        },
        select: { employeeId: true },
      });
    } catch {
      // Table may not exist in database
    }
    const odEmployeeIds = new Set(approvedODs.map((o) => o.employeeId));
    const onDuty = odEmployeeIds.size;

    // Check approved Leave requests on this date
    let approvedLeaves: Array<{ employeeId: string }> = [];
    try {
      approvedLeaves = await prisma.leave.findMany({
        where: {
          status: "APPROVED",
          startDate: { lte: endOfDay },
          endDate: { gte: startOfDay },
          employee: {
            status: activeStatuses,
            role: { name: { not: "ADMIN" } },
            ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
          },
        },
        select: { employeeId: true },
      });
    } catch {
      // Leave table query safety
    }

    const leaveEmployeeIds = new Set([
      ...attendances.filter((a) => a.status === "ON_LEAVE").map((a) => a.employeeId),
      ...approvedLeaves.map((l) => l.employeeId),
    ]);
    onLeave = leaveEmployeeIds.size;

    const nonAbsentEmployees = new Set([
      ...attendances.filter((a) => a.status !== "ABSENT").map((a) => a.employeeId),
      ...approvedODs.map((o) => o.employeeId),
      ...approvedLeaves.map((l) => l.employeeId),
    ]);

    // Check if date is a weekend (Sunday) or holiday
    const targetDateObj = dateInput ? new Date(dateInput) : new Date();
    const dayOfWeek = targetDateObj.getDay();
    let isHolidayOrWeekend = dayOfWeek === 0;

    if (!isHolidayOrWeekend) {
      try {
        const holidayCount = await prisma.holiday.count({
          where: {
            status: "ACTIVE",
            date: { gte: startOfDay, lte: endOfDay },
          },
        });
        if (holidayCount > 0) {
          isHolidayOrWeekend = true;
        }
      } catch {
        // Holiday table check
      }
    }

    let absent = 0;
    if (!isHolidayOrWeekend) {
      absent = Math.max(0, totalActiveEmployees - nonAbsentEmployees.size);
    }

    const presentCount = present + late + halfDay + onDuty;
    const attendanceRate = totalActiveEmployees > 0
      ? Math.round((presentCount / totalActiveEmployees) * 100)
      : 0;

    return {
      date: getKolkataDateString(dateInput),
      totalEmployees: totalActiveEmployees,
      present,
      absent,
      late,
      halfDay,
      onDuty,
      onLeave,
      working,
      onBreak,
      completed,
      attendanceRate,
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

    const activeStatuses: Prisma.EnumEmployeeStatusFilter = {
      in: ["ACTIVE", "PROBATION", "CONFIRMED", "NOTICE_PERIOD", "ONBOARDING"] as any,
    };
    const empWhere: any = {
      status: activeStatuses,
      role: { name: { not: "ADMIN" } },
    };
    if (filters.departmentId) {
      empWhere.departmentId = filters.departmentId;
    }

    // Safely query OD requests separately to avoid query failure if table missing
    const approvedODMap = new Map<string, any>();
    try {
      const approvedODs = await (prisma as any).onDutyRequest.findMany({
        where: {
          status: "APPROVED",
          date: { gte: startOfDay, lte: endOfDay },
        },
      });
      approvedODs.forEach((od: any) => approvedODMap.set(od.employeeId, od));
    } catch {
      // Table may not exist
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
      const approvedOD = approvedODMap.get(emp.id) || null;

      let currentState: "ABSENT" | "WORKING" | "ON_BREAK" | "COMPLETED" | "ON_DUTY" = "ABSENT";
      if (activeBreak) {
        currentState = "ON_BREAK";
      } else if (activeSession) {
        currentState = "WORKING";
      } else if (sessions.length > 0) {
        currentState = "COMPLETED";
      } else if (approvedOD) {
        currentState = "ON_DUTY";
      }

      const status =
        todayAttendance?.status ||
        (approvedOD ? (approvedOD.sessionType === "FULL_DAY" ? "PRESENT" : "HALF_DAY") : "ABSENT");

      const firstPunchIn = sessions[0]?.punchIn || null;
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      const lastPunchOut = lastSession?.punchOut || null;

      const currentSessionDuration = activeSession ? calculateDurationSeconds(activeSession.punchIn, now) : 0;
      const currentBreakDuration = activeBreak
        ? Math.min(180 * 60, calculateDurationSeconds(activeBreak.startTime, now))
        : 0;

      const breakHistory = sessions.flatMap((s) => s.breaks).map((b) => ({
        id: b.id,
        breakTypeName: b.breakType?.name || "Break",
        purpose: b.purpose || null,
        startTime: b.startTime,
        endTime: b.endTime,
        durationSeconds: b.endTime
          ? b.durationSeconds
          : Math.min(180 * 60, calculateDurationSeconds(b.startTime, now)),
      }));

      let declaredBreakSeconds = 0;
      let idleBreakSeconds = 0;
      breakHistory.forEach((b) => {
        if (b.breakTypeName === "System Idle" || b.breakTypeName === "Idle Break") {
          idleBreakSeconds += b.durationSeconds;
        } else {
          declaredBreakSeconds += b.durationSeconds;
        }
      });
      const totalBreakSeconds = declaredBreakSeconds + idleBreakSeconds;

      return {
        id: todayAttendance?.id || undefined,
        attendanceId: todayAttendance?.id || undefined,
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        avatar: emp.avatar,
        designation: emp.designation,
        department: emp.department?.name || null,
        status,
        currentState,
        punchIn: firstPunchIn,
        lastPunchOut,
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
        lateMinutes: todayAttendance?.lateMinutes || 0,
        breakHistory,
      };
    });

    if (filters.status && filters.status !== "ALL") {
      return states.filter((s) => s.currentState === filters.status);
    }

    return states;
  }
}
