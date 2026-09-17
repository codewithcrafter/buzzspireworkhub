import { prisma } from "@/lib/prisma";
import { SettingsService } from "./settings.service";
import { TimeInterval, normalizeIntervals, subtractIntervals, calculateTotalDurationSeconds, getTimeOnDate } from "@/lib/interval";
import { getStartOfDay, getEndOfDay } from "@/lib/date";

export interface DailyWorkingHoursResult {
  employeeId: string;
  date: string; // YYYY-MM-DD
  timezone: string;
  dayType: "WORKING_DAY" | "WEEKEND" | "HOLIDAY" | "ON_LEAVE";
  attendanceOpen: boolean;
  firstPunchIn: Date | null;
  lastPunchOut: Date | null;
  grossSpanMinutes: number;
  fixedLunchMinutes: number;
  declaredBreakMinutes: number;
  idleMinutes: number;
  workingMinutes: number;
  expectedWorkMinutes: number;
  lateMinutes: number;
  earlyLogoutMinutes: number;
  shortfallMinutes: number;
  overtimeMinutes: number;
  halfDay: boolean;
  status: string; // "PRESENT" | "ABSENT" | "HALF_DAY" | "ON_LEAVE" | "HOLIDAY" | "WEEKEND" | "OPEN_SESSION"
}

export class WorkingHoursService {
  /**
   * Helper to fetch global settings with fallbacks
   */
  private static async getEngineSettings() {
    const settings = await SettingsService.getAll();
    const getS = (key: string, fallback: any) => settings[key]?.value ?? fallback;
    
    return {
      officeStart: getS("office_start_time", "10:00"),
      officeEnd: getS("office_end_time", "19:00"),
      fixedLunchStart: getS("fixed_lunch_start_time", "14:00"),
      fixedLunchEnd: getS("fixed_lunch_end_time", "14:30"),
      expectedWorkMinutes: parseInt(getS("expected_work_minutes", "510"), 10),
      lateGrace: parseInt(getS("late_grace_minutes", "15"), 10),
      earlyLogoutGrace: parseInt(getS("early_logout_grace_minutes", "15"), 10),
      halfDayThreshold: parseInt(getS("half_day_threshold_minutes", "240"), 10),
      overtimeEnabled: getS("overtime_enabled", "true") === "true",
      timezone: getS("timezone", "Asia/Kolkata"),
    };
  }

  /**
   * Resolves the day type (Holiday, Leave, Weekend, Working Day)
   */
  public static async resolveWorkingDay(employeeId: string, date: Date, timezone: string): Promise<"WORKING_DAY" | "WEEKEND" | "HOLIDAY" | "ON_LEAVE"> {
    const startOfDay = getStartOfDay(date);
    const endOfDay = getEndOfDay(date);

    // 1. Check Holiday
    const holiday = await prisma.holiday.findFirst({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: "ACTIVE"
      }
    });
    if (holiday) return "HOLIDAY";

    // 2. Check Approved Leave
    const leave = await prisma.leave.findFirst({
      where: {
        employeeId,
        status: "APPROVED",
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay }
      }
    });
    if (leave) return "ON_LEAVE";

    // 3. Check Weekend (Assuming Saturday/Sunday in timezone)
    const tzDateStr = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(date);
    if (tzDateStr === "Sat" || tzDateStr === "Sun") return "WEEKEND";

    return "WORKING_DAY";
  }

  /**
   * Calculates the authoritative working hours for a single employee on a single day.
   */
  public static async calculateDaily(employeeId: string, dateInput: Date | string): Promise<DailyWorkingHoursResult> {
    const targetDate = new Date(dateInput);
    const startOfDay = getStartOfDay(targetDate);
    const endOfDay = getEndOfDay(targetDate);
    const dateString = targetDate.toISOString().split("T")[0];

    const settings = await this.getEngineSettings();
    const dayType = await this.resolveWorkingDay(employeeId, targetDate, settings.timezone);

    // 1. Fetch Attendance and Breaks
    const attendance = await prisma.attendance.findFirst({
      where: { employeeId, date: { gte: startOfDay, lte: endOfDay } },
      include: {
        sessions: {
          include: { breaks: { include: { breakType: true } } }
        }
      }
    });

    // 2. Fetch Idle Activity Logs matching this date
    // (We use ActivityLog to find specific IDLE_STATEs telemetry that might not be formally closed as breaks)
    // Actually, per Phase A, the Windows Agent auto-creates "Idle Break" Break records.
    // So we can rely on the Break records of type "Idle Break" (or legacy "System Idle").

    if (!attendance || attendance.sessions.length === 0) {
      return {
        employeeId,
        date: dateString,
        timezone: settings.timezone,
        dayType,
        attendanceOpen: false,
        firstPunchIn: null,
        lastPunchOut: null,
        grossSpanMinutes: 0,
        fixedLunchMinutes: 0,
        declaredBreakMinutes: 0,
        idleMinutes: 0,
        workingMinutes: 0,
        expectedWorkMinutes: dayType === "WORKING_DAY" ? settings.expectedWorkMinutes : 0,
        lateMinutes: 0,
        earlyLogoutMinutes: 0,
        shortfallMinutes: 0,
        overtimeMinutes: 0,
        halfDay: false,
        status: dayType === "WORKING_DAY" ? "ABSENT" : dayType
      };
    }

    const sessions = attendance.sessions;
    const nowMs = new Date().getTime();
    let attendanceOpen = false;

    // Gather raw intervals
    const attendanceIntervals: TimeInterval[] = [];
    const declaredBreakIntervals: TimeInterval[] = [];
    const idleBreakIntervals: TimeInterval[] = [];

    let firstPunchIn: Date | null = null;
    let lastPunchOut: Date | null = null;

    for (const s of sessions) {
      if (!firstPunchIn || s.punchIn < firstPunchIn) firstPunchIn = s.punchIn;
      if (s.punchOut && (!lastPunchOut || s.punchOut > lastPunchOut)) lastPunchOut = s.punchOut;
      
      const startMs = s.punchIn.getTime();
      let endMs = s.punchOut ? s.punchOut.getTime() : nowMs;
      
      if (!s.punchOut) attendanceOpen = true;

      attendanceIntervals.push({ start: startMs, end: endMs });

      for (const b of s.breaks) {
        const bStart = b.startTime.getTime();
        const bEnd = b.endTime ? b.endTime.getTime() : nowMs;
        
        if (b.breakType?.name === "System Idle" || b.breakType?.name === "Idle Break") {
          idleBreakIntervals.push({ start: bStart, end: bEnd });
        } else {
          declaredBreakIntervals.push({ start: bStart, end: bEnd });
        }
      }
    }

    // Normalize all intervals
    const normalizedAttendance = normalizeIntervals(attendanceIntervals);
    const normalizedDeclaredBreaks = normalizeIntervals(declaredBreakIntervals);
    const normalizedIdleBreaks = normalizeIntervals(idleBreakIntervals);

    // Calculate Fixed Lunch interval for this specific day
    const lunchStartMs = getTimeOnDate(targetDate, settings.fixedLunchStart, settings.timezone);
    const lunchEndMs = getTimeOnDate(targetDate, settings.fixedLunchEnd, settings.timezone);
    const fixedLunchIntervals = normalizeIntervals([{ start: lunchStartMs, end: lunchEndMs }]);

    // Only apply fixed lunch if they were actually punched in during that time
    let workingIntervals = [...normalizedAttendance];

    // Subtract Idle Breaks first
    workingIntervals = subtractIntervals(workingIntervals, normalizedIdleBreaks);
    
    // Subtract Declared Breaks
    workingIntervals = subtractIntervals(workingIntervals, normalizedDeclaredBreaks);
    
    // Subtract Fixed Lunch
    workingIntervals = subtractIntervals(workingIntervals, fixedLunchIntervals);

    // Calculate metrics in seconds, then convert to minutes
    const grossSpanSecs = calculateTotalDurationSeconds(normalizedAttendance);
    
    // For declared breaks, only count the portions that overlap with attendance
    let validDeclaredBreaks = [...normalizedDeclaredBreaks];
    validDeclaredBreaks = subtractIntervals(validDeclaredBreaks, normalizedIdleBreaks); // Prevent overlap between idle and declared
    
    const declaredBreakSecs = calculateTotalDurationSeconds(validDeclaredBreaks);
    const idleSecs = calculateTotalDurationSeconds(normalizedIdleBreaks);
    
    // Fixed lunch is just a flat deduction IF it overlaps with their attendance and hasn't already been deducted by a declared break or idle
    let effectiveLunchDeduction = [...fixedLunchIntervals];
    // We only deduct lunch if they were here
    let lunchOverlapWithAttendance = subtractIntervals(fixedLunchIntervals, subtractIntervals(fixedLunchIntervals, normalizedAttendance));
    // And subtract the declared breaks / idles that already ate into the lunch window to avoid double deducting
    let netLunchDeduction = subtractIntervals(lunchOverlapWithAttendance, normalizedDeclaredBreaks);
    netLunchDeduction = subtractIntervals(netLunchDeduction, normalizedIdleBreaks);
    
    const fixedLunchSecs = calculateTotalDurationSeconds(netLunchDeduction);
    
    const workingSecs = calculateTotalDurationSeconds(workingIntervals);

    const grossSpanMinutes = Math.floor(grossSpanSecs / 60);
    const declaredBreakMinutes = Math.floor(declaredBreakSecs / 60);
    const idleMinutes = Math.floor(idleSecs / 60);
    const fixedLunchMinutes = Math.floor(fixedLunchSecs / 60);
    const workingMinutes = Math.floor(workingSecs / 60);

    // Late / Early calculations
    let lateMinutes = 0;
    let earlyLogoutMinutes = 0;

    if (firstPunchIn) {
      const shiftStartMs = getTimeOnDate(targetDate, settings.officeStart, settings.timezone);
      const diffStart = firstPunchIn.getTime() - shiftStartMs;
      if (diffStart > settings.lateGrace * 60000) {
        lateMinutes = Math.floor(diffStart / 60000);
      }
    }

    if (lastPunchOut && !attendanceOpen) {
      const shiftEndMs = getTimeOnDate(targetDate, settings.officeEnd, settings.timezone);
      const diffEnd = shiftEndMs - lastPunchOut.getTime();
      if (diffEnd > settings.earlyLogoutGrace * 60000) {
        earlyLogoutMinutes = Math.floor(diffEnd / 60000);
      }
    }

    // Shortfall & Overtime
    let shortfallMinutes = 0;
    let overtimeMinutes = 0;
    let expectedWorkMinutes = dayType === "WORKING_DAY" ? settings.expectedWorkMinutes : 0;

    if (dayType === "WORKING_DAY") {
      if (workingMinutes < expectedWorkMinutes) {
        shortfallMinutes = expectedWorkMinutes - workingMinutes;
      } else if (settings.overtimeEnabled && workingMinutes > expectedWorkMinutes) {
        overtimeMinutes = workingMinutes - expectedWorkMinutes;
      }
    }

    const halfDay = workingMinutes > 0 && workingMinutes < settings.halfDayThreshold;

    let status = attendanceOpen ? "OPEN_SESSION" : "PRESENT";
    if (dayType !== "WORKING_DAY" && workingMinutes === 0) {
      status = dayType;
    } else if (halfDay && !attendanceOpen) {
      status = "HALF_DAY";
    }

    return {
      employeeId,
      date: dateString,
      timezone: settings.timezone,
      dayType,
      attendanceOpen,
      firstPunchIn,
      lastPunchOut,
      grossSpanMinutes,
      fixedLunchMinutes,
      declaredBreakMinutes,
      idleMinutes,
      workingMinutes,
      expectedWorkMinutes,
      lateMinutes,
      earlyLogoutMinutes,
      shortfallMinutes,
      overtimeMinutes,
      halfDay,
      status
    };
  }

  /**
   * Calculates the working hours for a specific period, aggregating the daily metrics.
   */
  public static async calculatePeriod(employeeId: string, startDate: Date | string, endDate: Date | string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const dailyResults: DailyWorkingHoursResult[] = [];
    
    // Iterate day by day
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const result = await this.calculateDaily(employeeId, d);
      dailyResults.push(result);
    }

    // Aggregate
    const summary = {
      workingDays: dailyResults.filter(r => r.dayType === "WORKING_DAY").length,
      presentDays: dailyResults.filter(r => r.status === "PRESENT").length,
      halfDays: dailyResults.filter(r => r.status === "HALF_DAY").length,
      leaveDays: dailyResults.filter(r => r.dayType === "ON_LEAVE").length,
      holidayDays: dailyResults.filter(r => r.dayType === "HOLIDAY").length,
      weekendDays: dailyResults.filter(r => r.dayType === "WEEKEND").length,
      
      totalWorkingMinutes: dailyResults.reduce((acc, r) => acc + r.workingMinutes, 0),
      totalExpectedMinutes: dailyResults.reduce((acc, r) => acc + r.expectedWorkMinutes, 0),
      totalShortfallMinutes: dailyResults.reduce((acc, r) => acc + r.shortfallMinutes, 0),
      totalOvertimeMinutes: dailyResults.reduce((acc, r) => acc + r.overtimeMinutes, 0),
      totalLateMinutes: dailyResults.reduce((acc, r) => acc + r.lateMinutes, 0),
      totalEarlyLogoutMinutes: dailyResults.reduce((acc, r) => acc + r.earlyLogoutMinutes, 0),
      totalDeclaredBreakMinutes: dailyResults.reduce((acc, r) => acc + r.declaredBreakMinutes, 0),
      totalIdleMinutes: dailyResults.reduce((acc, r) => acc + r.idleMinutes, 0),
    };

    return {
      employeeId,
      summary,
      daily: dailyResults
    };
  }
}
