import { prisma } from "@/lib/prisma";
import { WorkingHoursService } from "./working-hours.service";
import { SettingsService } from "./settings.service";
import { SalaryType } from "@prisma/client";

export interface PayrollDeductionDraft {
  type: string;
  date?: Date;
  minutes?: number;
  amount: number;
  description?: string;
}

export interface PayrollRecordDraft {
  employeeId: string;
  salaryType: SalaryType;
  baseMonthlySalary: number | null;
  baseHourlyRate: number | null;
  workingDaysMode: string | null;
  workingDaysDivisor: number | null;

  expectedMinutes: number;
  workingMinutes: number;
  shortfallMinutes: number;
  overtimeMinutes: number;
  lateMinutes: number;
  earlyLogoutMinutes: number;

  workingDays: number;
  presentDays: number;
  absentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  holidayDays: number;
  weekendDays: number;
  halfDays: number;

  basePay: number;
  overtimePay: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;

  deductions: PayrollDeductionDraft[];
}

export class PayrollService {
  /**
   * Calculates a draft payroll record for an employee over a specific period.
   * This is entirely mathematically derived from WorkingHoursService (TIME) + Settings (POLICY).
   */
  static async calculateDraft(employeeId: string, periodStart: Date, periodEnd: Date): Promise<PayrollRecordDraft> {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) throw new Error("Employee not found");

    const settings = await SettingsService.getAll();
    
    const salaryMode = settings["salary_calculation_mode"]?.value || "WORKING_DAYS";
    const otEnabled = settings["overtime_enabled"]?.value === "true";
    const otMultiplier = parseFloat(settings["overtime_multiplier"]?.value || "1.0");
    
    const lateEnabled = settings["late_deduction_enabled"]?.value === "true";
    const earlyEnabled = settings["early_logout_deduction_enabled"]?.value === "true";
    const shortfallEnabled = settings["shortfall_deduction_enabled"]?.value === "true";
    const halfDayEnabled = settings["half_day_deduction_enabled"]?.value === "true";
    const unpaidLeaveEnabled = settings["unpaid_leave_deduction_enabled"]?.value === "true";

    const isMonthly = employee.monthlySalary !== null && employee.monthlySalary > 0;
    const salaryType: SalaryType = isMonthly ? "MONTHLY" : "HOURLY";
    const monthlySalary = employee.monthlySalary || 0;
    const hourlyRate = employee.hourlyRate || 0;

    // Aggregates
    let expectedMinutes = 0, workingMinutes = 0, shortfallMinutes = 0, overtimeMinutes = 0;
    let lateMinutes = 0, earlyLogoutMinutes = 0;
    
    let workingDaysCount = 0, presentDays = 0, absentDays = 0, paidLeaveDays = 0;
    let unpaidLeaveDays = 0, holidayDays = 0, weekendDays = 0, halfDaysCount = 0;

    let calendarDaysCount = 0;
    
    // We need to fetch the daily metrics first to know how many working days there are
    // so we can compute the daily rate accurately for MONTHLY employees.
    const dailyMetrics = [];
    
    const curr = new Date(periodStart);
    curr.setHours(0,0,0,0);
    const end = new Date(periodEnd);
    end.setHours(23,59,59,999);

    while (curr <= end) {
      calendarDaysCount++;
      const targetDateStr = curr.toISOString().split("T")[0];
      const metric = await WorkingHoursService.calculateDaily(employeeId, targetDateStr);
      dailyMetrics.push({ date: new Date(curr), metric });
      
      // Categorize day
      if (metric.dayType === "WORKING_DAY") {
        workingDaysCount++;
        if (metric.status === "PRESENT" || metric.status === "LATE") {
          presentDays++;
        } else if (metric.status === "ABSENT") {
          absentDays++;
        } else if (metric.status === "HALF_DAY") {
          halfDaysCount++;
        }
      } else if (metric.dayType === "ON_LEAVE") {
        // Simple logic for paid vs unpaid. Expand as needed.
        // For now, if the engine resolved it as leave, we assume paid unless explicitly configured.
        paidLeaveDays++;
      } else if (metric.dayType === "HOLIDAY") {
        holidayDays++;
      } else if (metric.dayType === "WEEKEND") {
        weekendDays++;
      }

      // Aggregate time
      expectedMinutes += metric.expectedWorkMinutes;
      workingMinutes += metric.workingMinutes;
      shortfallMinutes += metric.shortfallMinutes;
      overtimeMinutes += metric.overtimeMinutes;
      lateMinutes += metric.lateMinutes;
      earlyLogoutMinutes += metric.earlyLogoutMinutes;

      curr.setDate(curr.getDate() + 1);
    }

    // Determine Base Rates
    let dailyRate = 0;
    let effectiveHourlyRate = hourlyRate;
    let workingDaysDivisor = 0;

    if (salaryType === "MONTHLY") {
      workingDaysDivisor = salaryMode === "CALENDAR_DAYS" ? calendarDaysCount : workingDaysCount;
      dailyRate = workingDaysDivisor > 0 ? monthlySalary / workingDaysDivisor : 0;
      effectiveHourlyRate = dailyRate / (parseFloat(settings["expected_work_minutes"]?.value || "510") / 60);
    } else {
      dailyRate = hourlyRate * (parseFloat(settings["expected_work_minutes"]?.value || "510") / 60);
    }

    let basePay = salaryType === "MONTHLY" ? monthlySalary : (workingMinutes / 60) * hourlyRate;
    let overtimePay = otEnabled && otMultiplier > 0 ? (overtimeMinutes / 60) * (effectiveHourlyRate * otMultiplier) : 0;
    
    // Deductions Engine
    let totalDeductions = 0;
    const deductions: PayrollDeductionDraft[] = [];

    const addDeduction = (type: string, date: Date | undefined, mins: number | undefined, amount: number, desc: string) => {
      const roundedAmt = Math.round(amount * 100) / 100;
      if (roundedAmt > 0) {
        deductions.push({ type, date, minutes: mins, amount: roundedAmt, description: desc });
        totalDeductions += roundedAmt;
      }
    };

    // Calculate daily deductions safely preventing double-deduction
    for (const dm of dailyMetrics) {
      const m = dm.metric;
      let dayDeducted = false;

      // 1. Absence (Highest precedence)
      if (m.dayType === "WORKING_DAY" && m.status === "ABSENT") {
        // If they are monthly, being absent means we deduct the daily rate.
        // If they are hourly, they just don't get paid for this day, so no explicit deduction from base.
        if (salaryType === "MONTHLY") {
          addDeduction("ABSENT", dm.date, undefined, dailyRate, "Absent on working day");
        }
        dayDeducted = true;
      }

      // 2. Unpaid Leave
      if (!dayDeducted && m.dayType === "ON_LEAVE" && unpaidLeaveEnabled) {
        // Hypothetical logic if we tracked unpaid leaves
        // addDeduction("UNPAID_LEAVE", dm.date, undefined, dailyRate, "Unpaid Leave");
        // dayDeducted = true;
      }

      // 3. Half Day
      if (!dayDeducted && m.status === "HALF_DAY" && halfDayEnabled) {
        if (salaryType === "MONTHLY") {
           addDeduction("HALF_DAY", dm.date, undefined, dailyRate / 2, "Half day applied");
        }
        // Since we did a half-day deduction, we won't additionally deduct shortfall for this day to avoid double dipping
        dayDeducted = true;
      }

      // 4. Shortfall
      if (!dayDeducted && m.shortfallMinutes > 0 && shortfallEnabled) {
        const amt = (m.shortfallMinutes / 60) * effectiveHourlyRate;
        addDeduction("SHORTFALL", dm.date, m.shortfallMinutes, amt, "Shortfall minutes");
        dayDeducted = true;
      }

      // 5. Late / Early Logout (Only if not already deducted by shortfall/absence)
      // Usually, if a company deducts shortfall, they don't also deduct the exact same late minutes twice.
      if (!dayDeducted) {
        if (m.lateMinutes > 0 && lateEnabled) {
          const amt = (m.lateMinutes / 60) * effectiveHourlyRate;
          addDeduction("LATE", dm.date, m.lateMinutes, amt, "Late login");
        }
        if (m.earlyLogoutMinutes > 0 && earlyEnabled) {
          const amt = (m.earlyLogoutMinutes / 60) * effectiveHourlyRate;
          addDeduction("EARLY_LOGOUT", dm.date, m.earlyLogoutMinutes, amt, "Early logout");
        }
      }
    }

    // Money Formatting
    basePay = Math.round(basePay * 100) / 100;
    overtimePay = Math.round(overtimePay * 100) / 100;
    totalDeductions = Math.round(totalDeductions * 100) / 100;

    let grossPay = basePay + overtimePay;
    let netPay = Math.max(0, grossPay - totalDeductions); // Floor at 0

    return {
      employeeId,
      salaryType,
      baseMonthlySalary: employee.monthlySalary,
      baseHourlyRate: employee.hourlyRate,
      workingDaysMode: salaryMode,
      workingDaysDivisor: salaryType === "MONTHLY" ? workingDaysDivisor : null,
      
      expectedMinutes, workingMinutes, shortfallMinutes, overtimeMinutes, lateMinutes, earlyLogoutMinutes,
      
      workingDays: workingDaysCount, presentDays, absentDays, paidLeaveDays, unpaidLeaveDays, holidayDays, weekendDays, halfDays: halfDaysCount,

      basePay, overtimePay, grossPay, totalDeductions, netPay,
      deductions
    };
  }

  /**
   * Generates or retrieves a Payroll Run.
   */
  static async runPayrollMonth(month: number, year: number): Promise<any> {
    // Determine boundaries
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0); // Last day of month

    let run = await prisma.payrollRun.findUnique({
      where: { month_year: { month, year } }
    });

    if (!run) {
      run = await prisma.payrollRun.create({
        data: {
          month, year, periodStart, periodEnd, status: "DRAFT"
        }
      });
    }

    if (run.status === "APPROVED" || run.status === "PAID") {
      throw new Error("Payroll is already locked for this period.");
    }

    const employees = await prisma.employee.findMany({
      where: { status: "ACTIVE" },
      include: { department: true } // Need department for snapshot
    });

    let totalGross = 0;
    let totalDed = 0;
    let totalNet = 0;

    // Delete existing draft records for this run to recalculate fresh
    await prisma.payrollRecord.deleteMany({
      where: { payrollRunId: run.id }
    });

    for (const emp of employees) {
      const draft = await this.calculateDraft(emp.id, periodStart, periodEnd);
      
      const record = await prisma.payrollRecord.create({
        data: {
          payrollRunId: run.id,
          employeeId: draft.employeeId,
          departmentSnapshot: emp.department ? { id: emp.department.id, name: emp.department.name } : { id: null, name: null },
          salaryType: draft.salaryType,
          baseMonthlySalary: draft.baseMonthlySalary,
          baseHourlyRate: draft.baseHourlyRate,
          workingDaysMode: draft.workingDaysMode,
          workingDaysDivisor: draft.workingDaysDivisor,
          expectedMinutes: draft.expectedMinutes,
          workingMinutes: draft.workingMinutes,
          shortfallMinutes: draft.shortfallMinutes,
          overtimeMinutes: draft.overtimeMinutes,
          lateMinutes: draft.lateMinutes,
          earlyLogoutMinutes: draft.earlyLogoutMinutes,
          workingDays: draft.workingDays,
          presentDays: draft.presentDays,
          absentDays: draft.absentDays,
          paidLeaveDays: draft.paidLeaveDays,
          unpaidLeaveDays: draft.unpaidLeaveDays,
          holidayDays: draft.holidayDays,
          weekendDays: draft.weekendDays,
          halfDays: draft.halfDays,
          basePay: draft.basePay,
          overtimePay: draft.overtimePay,
          grossPay: draft.grossPay,
          totalDeductions: draft.totalDeductions,
          netPay: draft.netPay,
          status: "DRAFT",
          deductions: {
            create: draft.deductions.map(d => ({
              type: d.type,
              date: d.date,
              minutes: d.minutes,
              amount: d.amount,
              description: d.description
            }))
          }
        }
      });

      totalGross += record.grossPay;
      totalDed += record.totalDeductions;
      totalNet += record.netPay;
    }

    return prisma.payrollRun.update({
      where: { id: run.id },
      data: {
        totalEmployees: employees.length,
        totalGrossPay: totalGross,
        totalDeductions: totalDed,
        totalNetPay: totalNet,
        status: "CALCULATED"
      },
      include: {
        records: {
          include: { deductions: true, employee: { select: { fullName: true, employeeId: true } } }
        }
      }
    });
  }
}
