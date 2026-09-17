import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { PayrollService } from "@/services/payroll.service";
import { AuditService } from "@/services/audit.service";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const month = parseInt(body.month);
    const year = parseInt(body.year);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json({ error: "Invalid month/year" }, { status: 400 });
    }

    const run = await PayrollService.runPayrollMonth(month, year);

    // Fire-and-forget audit
    AuditService.log({
      employeeId: auth.employee.id,
      action: "CREATE",
      module: "PAYROLL",
      description: `Payroll generated for ${month}/${year}`,
      metadata: { month, year, runId: run.id }
    }).catch(() => {});

    return NextResponse.json(run);
  } catch (error: any) {
    console.error("Payroll run error:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate payroll" }, { status: 500 });
  }
}
