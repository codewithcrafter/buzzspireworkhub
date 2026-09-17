const fs = require('fs');
const schema = `
// ==========================================
// PHASE D: PAYROLL & SALARY ENGINE
// ==========================================

enum PayrollStatus {
  DRAFT
  CALCULATED
  APPROVED
  PAID
}

enum SalaryType {
  MONTHLY
  HOURLY
}

model PayrollRun {
  id              String          @id @default(uuid())
  month           Int             // 1-12
  year            Int             // e.g. 2026
  periodStart     DateTime
  periodEnd       DateTime
  status          PayrollStatus   @default(DRAFT)
  totalEmployees  Int             @default(0)
  totalGrossPay   Float           @default(0)
  totalDeductions Float           @default(0)
  totalNetPay     Float           @default(0)
  processedBy     String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  records         PayrollRecord[]

  @@unique([month, year])
}

model PayrollRecord {
  id                       String            @id @default(uuid())
  payrollRunId             String
  employeeId               String
  
  // Snapshots at time of calculation
  salaryType               SalaryType
  baseMonthlySalary        Float?
  baseHourlyRate           Float?
  workingDaysMode          String?           // "CALENDAR_DAYS" or "WORKING_DAYS"
  workingDaysDivisor       Float?
  
  // Time Metrics (Minutes)
  expectedMinutes          Int               @default(0)
  workingMinutes           Int               @default(0)
  shortfallMinutes         Int               @default(0)
  overtimeMinutes          Int               @default(0)
  lateMinutes              Int               @default(0)
  earlyLogoutMinutes       Int               @default(0)
  
  // Day Metrics
  workingDays              Float             @default(0)
  presentDays              Float             @default(0)
  absentDays               Float             @default(0)
  paidLeaveDays            Float             @default(0)
  unpaidLeaveDays          Float             @default(0)
  holidayDays              Float             @default(0)
  weekendDays              Float             @default(0)
  halfDays                 Float             @default(0)

  // Financial Metrics
  basePay                  Float             @default(0)
  overtimePay              Float             @default(0)
  grossPay                 Float             @default(0)
  totalDeductions          Float             @default(0)
  netPay                   Float             @default(0)
  
  status                   PayrollStatus     @default(DRAFT)
  calculationPolicyVersion String            @default("PAYROLL_V1")
  
  createdAt                DateTime          @default(now())
  updatedAt                DateTime          @updatedAt

  payrollRun               PayrollRun        @relation(fields: [payrollRunId], references: [id], onDelete: Cascade)
  employee                 Employee          @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  deductions               PayrollDeduction[]

  @@unique([payrollRunId, employeeId])
  @@index([employeeId])
}

model PayrollDeduction {
  id              String        @id @default(uuid())
  payrollRecordId String
  type            String        // "ABSENT", "UNPAID_LEAVE", "LATE", "EARLY_LOGOUT", "SHORTFALL", "HALF_DAY"
  date            DateTime?     // The specific date this deduction occurred
  minutes         Int?          // The raw minutes deducted (if applicable)
  amount          Float         // The financial value deducted
  description     String?
  createdAt       DateTime      @default(now())
  
  payrollRecord   PayrollRecord @relation(fields: [payrollRecordId], references: [id], onDelete: Cascade)
  
  @@index([payrollRecordId])
}
`;

fs.appendFileSync('prisma/schema.prisma', schema, 'utf8');
console.log("Schema updated.");
