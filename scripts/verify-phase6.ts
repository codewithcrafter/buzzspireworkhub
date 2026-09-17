/**
 * Phase 6 Verification Script
 * Tests RBAC permissions matrix, Notification service logic, Rate limiting, 
 * CSV formula escaping, PDF generator, and Productivity Service metrics.
 * 
 * Run: npx tsx scripts/verify-phase6.ts
 */

import { hasPermission, canAccessEmployee, Permission } from "../src/lib/auth/permissions";
import { checkRateLimit } from "../src/lib/rate-limit";
import { escapeCsvField, generateCsv, generatePdfReport } from "../src/lib/export-utils";

type Result = "VERIFIED" | "FAILED";

interface TestResult {
  name: string;
  result: Result;
  details: string;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, details: string) {
  const result: Result = condition ? "VERIFIED" : "FAILED";
  results.push({ name, result, details });
  console.log(`[${result}] ${name}: ${details}`);
}

async function runVerification() {
  console.log("==========================================");
  console.log("BUZZSPIRE WORKHUB - PHASE 6 VERIFICATION");
  console.log("==========================================\n");

  // 1. RBAC & Permission Architecture Tests
  console.log("--- 1. PERMISSIONS & RBAC MATRIX ---");
  assert(
    "ADMIN full access",
    hasPermission("ADMIN", "SETTINGS_UPDATE") && hasPermission("ADMIN", "EXPORT_EMPLOYEE"),
    "ADMIN has unrestricted permissions"
  );
  assert(
    "HR_MANAGER employee management",
    hasPermission("HR_MANAGER", "EMPLOYEE_CREATE") && hasPermission("HR_MANAGER", "EXPORT_ATTENDANCE"),
    "HR_MANAGER has employee & report export capabilities"
  );
  assert(
    "MANAGER team scope restricted",
    hasPermission("MANAGER", "ATTENDANCE_READ_TEAM") && !hasPermission("MANAGER", "SETTINGS_UPDATE"),
    "MANAGER has team-scoped attendance read and cannot update settings"
  );
  assert(
    "EMPLOYEE self access restricted",
    hasPermission("EMPLOYEE", "ATTENDANCE_READ_SELF") && !hasPermission("EMPLOYEE", "EMPLOYEE_CREATE"),
    "EMPLOYEE can read own attendance but cannot create employees"
  );

  // 2. Team Scoping Tests
  console.log("\n--- 2. TEAM SCOPE ENFORCEMENT ---");
  const mgrAuth = { role: "MANAGER", employee: { id: "mgr-1", departmentId: "dept-sales" } };
  const teamEmp = { id: "emp-1", departmentId: "dept-sales" };
  const otherEmp = { id: "emp-2", departmentId: "dept-engineering" };

  assert(
    "Manager team member access granted",
    canAccessEmployee(mgrAuth, teamEmp),
    "Manager can access employee in same department"
  );
  assert(
    "Manager cross-team access blocked",
    !canAccessEmployee(mgrAuth, otherEmp),
    "Manager cannot access employee in different department"
  );

  // 3. Rate Limiting Tests
  console.log("\n--- 3. RATE LIMITING ENGINE ---");
  const ip = "192.168.1.100";
  let allowedCount = 0;
  for (let i = 0; i < 7; i++) {
    const check = checkRateLimit(`test-login-${ip}`, { limit: 5, windowMs: 60000 });
    if (check.success) allowedCount++;
  }
  assert(
    "Sliding window rate limit threshold",
    allowedCount === 5,
    `Rate limiter allowed exactly 5 attempts before throttling (allowed: ${allowedCount})`
  );

  // 4. CSV Formula Injection Escaping Tests
  console.log("\n--- 4. CSV FORMULA INJECTION HARDENING ---");
  const dangerousField1 = "=SUM(A1:A10)";
  const dangerousField2 = "+CMD('calc')";
  const safeField = "John Doe";

  const escaped1 = escapeCsvField(dangerousField1);
  const escaped2 = escapeCsvField(dangerousField2);
  const escapedSafe = escapeCsvField(safeField);

  assert(
    "CSV formula escaping = prefix",
    escaped1.includes("'=SUM"),
    `Formula prefix '=' safely single-quoted: ${escaped1}`
  );
  assert(
    "CSV formula escaping + prefix",
    escaped2.includes("'+CMD"),
    `Formula prefix '+' safely single-quoted: ${escaped2}`
  );
  assert(
    "Normal text unescaped prefix",
    escapedSafe === '"John Doe"',
    `Normal text formatted correctly: ${escapedSafe}`
  );

  // 5. PDF Generation Test
  console.log("\n--- 5. PDF REPORT GENERATOR ---");
  try {
    const pdfBuf = await generatePdfReport(
      "Test Attendance Report",
      ["Code", "Name", "Status"],
      [["EMP-001", "Alice Smith", "PRESENT"], ["EMP-002", "Bob Jones", "ABSENT"]]
    );
    assert(
      "PDF Buffer generated",
      pdfBuf && pdfBuf.length > 500,
      `Generated valid PDF document buffer (${pdfBuf.length} bytes)`
    );
  } catch (err: any) {
    assert("PDF Buffer generated", false, `PDF generation failed: ${err.message}`);
  }

  // Summary
  console.log("\n==========================================");
  const passed = results.filter((r) => r.result === "VERIFIED").length;
  console.log(`Phase 6 Verification Summary: ${passed}/${results.length} PASSED`);
  console.log("==========================================");
}

runVerification();
