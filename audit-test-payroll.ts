// audit-test-payroll.ts

function calculateDraftPure(
  salaryType: string,
  monthlySalary: number,
  hourlyRate: number,
  expectedMinutesTotal: number,
  days: any[],
  settings: any
) {
  const salaryMode = settings.salary_calculation_mode || "WORKING_DAYS";
  const otEnabled = settings.overtime_enabled;
  const otMultiplier = settings.overtime_multiplier;
  
  const lateEnabled = settings.late_deduction_enabled;
  const earlyEnabled = settings.early_logout_deduction_enabled;
  const shortfallEnabled = settings.shortfall_deduction_enabled;
  const halfDayEnabled = settings.half_day_deduction_enabled;

  let workingDaysCount = 0;
  let calendarDaysCount = days.length;
  let totalWorkingMins = 0;
  let totalOvertimeMins = 0;

  for (const d of days) {
    if (d.dayType === "WORKING_DAY") workingDaysCount++;
    totalWorkingMins += d.workingMinutes;
    totalOvertimeMins += d.overtimeMinutes;
  }

  let dailyRate = 0;
  let effectiveHourlyRate = hourlyRate;
  let workingDaysDivisor = salaryMode === "CALENDAR_DAYS" ? calendarDaysCount : workingDaysCount;

  if (salaryType === "MONTHLY") {
    dailyRate = monthlySalary / workingDaysDivisor;
    effectiveHourlyRate = dailyRate / (settings.expected_work_minutes / 60);
  } else {
    dailyRate = hourlyRate * (settings.expected_work_minutes / 60);
  }

  let basePay = salaryType === "MONTHLY" ? monthlySalary : (totalWorkingMins / 60) * hourlyRate;
  let overtimePay = otEnabled ? (totalOvertimeMins / 60) * (effectiveHourlyRate * otMultiplier) : 0;

  let totalDeductions = 0;
  const deductions: any[] = [];

  const addDeduction = (type: string, amount: number) => {
    deductions.push({ type, amount });
    totalDeductions += amount;
  };

  for (const m of days) {
    let dayDeducted = false;

    // 1. Absence
    if (m.dayType === "WORKING_DAY" && m.status === "ABSENT") {
      if (salaryType === "MONTHLY") addDeduction("ABSENT", dailyRate);
      dayDeducted = true;
    }

    // 3. Half Day
    if (!dayDeducted && m.status === "HALF_DAY" && halfDayEnabled) {
      if (salaryType === "MONTHLY") addDeduction("HALF_DAY", dailyRate / 2);
      dayDeducted = true;
    }

    // 4. Shortfall
    if (!dayDeducted && m.shortfallMinutes > 0 && shortfallEnabled) {
      addDeduction("SHORTFALL", (m.shortfallMinutes / 60) * effectiveHourlyRate);
      dayDeducted = true;
    }

    // 5. Late / Early
    if (!dayDeducted) {
      if (m.lateMinutes > 0 && lateEnabled) {
        addDeduction("LATE", (m.lateMinutes / 60) * effectiveHourlyRate);
      }
      if (m.earlyLogoutMinutes > 0 && earlyEnabled) {
        addDeduction("EARLY_LOGOUT", (m.earlyLogoutMinutes / 60) * effectiveHourlyRate);
      }
    }
  }

  let gross = basePay + overtimePay;
  let net = Math.max(0, gross - totalDeductions);

  return { basePay, overtimePay, gross, totalDeductions, deductions, net };
}

function runPayrollAudit() {
  const settings = {
    salary_calculation_mode: "WORKING_DAYS",
    overtime_enabled: true,
    overtime_multiplier: 1.5,
    late_deduction_enabled: true,
    early_logout_deduction_enabled: true,
    shortfall_deduction_enabled: true,
    half_day_deduction_enabled: true,
    expected_work_minutes: 480 // 8 hours
  };

  console.log("=== SCENARIO 1: Double Deduction Protection ===");
  // Half Day + Shortfall (Should only deduct half day, no shortfall)
  const days1 = [
    { dayType: "WORKING_DAY", status: "HALF_DAY", workingMinutes: 240, shortfallMinutes: 240, lateMinutes: 60, overtimeMinutes: 0 }
  ];
  const r1 = calculateDraftPure("MONTHLY", 3000, 0, 480, days1, settings);
  console.log("Monthly 3000 (Daily 3000). Day has Half-Day + Shortfall + Late.");
  console.log("Deductions:", r1.deductions.map(d => d.type).join(", "));
  console.log("Total Deducted:", r1.totalDeductions, "(Expected exactly 1500 for Half-Day only)");
  
  console.log("\n=== SCENARIO 2: Absent + Late ===");
  const days2 = [
    { dayType: "WORKING_DAY", status: "ABSENT", workingMinutes: 0, shortfallMinutes: 480, lateMinutes: 0, overtimeMinutes: 0 }
  ];
  const r2 = calculateDraftPure("MONTHLY", 3000, 0, 480, days2, settings);
  console.log("Deductions:", r2.deductions.map(d => d.type).join(", "));
  console.log("Total Deducted:", r2.totalDeductions, "(Expected exactly 3000 for Absent)");

  console.log("\n=== SCENARIO 3: Late + Early Logout (No shortfall) ===");
  // Employee works full 8 hours, but came late 1h and left early 1h (meaning they did 2h overtime in middle of day or just had weird schedule but hit quota?)
  // Actually, let's say they worked exactly 8 hours but shifted. Shortfall=0.
  const days3 = [
    { dayType: "WORKING_DAY", status: "PRESENT", workingMinutes: 480, shortfallMinutes: 0, lateMinutes: 60, earlyLogoutMinutes: 60, overtimeMinutes: 0 }
  ];
  // Hourly rate = 3000 / 8 = 375
  const r3 = calculateDraftPure("MONTHLY", 3000, 0, 480, days3, settings);
  console.log("Deductions:", r3.deductions.map(d => d.type).join(", "));
  console.log("Total Deducted:", r3.totalDeductions, "(Expected exactly 750 for 2h total)");

  console.log("\n=== SCENARIO 4: Overtime Calculation ===");
  const days4 = [
    { dayType: "WORKING_DAY", status: "PRESENT", workingMinutes: 540, shortfallMinutes: 0, lateMinutes: 0, earlyLogoutMinutes: 0, overtimeMinutes: 60 }
  ];
  const r4 = calculateDraftPure("MONTHLY", 3000, 0, 480, days4, settings);
  console.log("Base:", r4.basePay, "Overtime:", r4.overtimePay, "(Expected 375 * 1.5 = 562.5)");
}

runPayrollAudit();
