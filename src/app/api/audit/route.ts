import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AuditService } from "@/services/audit.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/audit
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // RBAC: Only ADMIN, HR_MANAGER, and COMPLIANCE_AUDITOR roles can query audit logs
    const isAuthorized = hasRole(auth.role, [
      "ADMIN",
      "HR_MANAGER",
      "COMPLIANCE_AUDITOR" as any,
    ]);

    if (!isAuthorized) {
      return ApiResponse.forbidden(
        "Access denied: Insufficient permissions to view security audit logs"
      );
    }

    const { searchParams } = new URL(req.url);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : undefined;
    const endDate = rawEnd ? new Date(rawEnd) : undefined;

    if (startDate && isNaN(startDate.getTime())) {
      return ApiResponse.badRequest("Invalid startDate format. Use ISO format (YYYY-MM-DD).");
    }
    if (endDate && isNaN(endDate.getTime())) {
      return ApiResponse.badRequest("Invalid endDate format. Use ISO format (YYYY-MM-DD).");
    }

    if (startDate && endDate && startDate > endDate) {
      return ApiResponse.badRequest("startDate cannot be after endDate.");
    }

    const employeeId = searchParams.get("employeeId") || undefined;
    const performedById = searchParams.get("performedById") || searchParams.get("actorId") || undefined;
    const action = searchParams.get("action") || undefined;
    const module = searchParams.get("module") || searchParams.get("entity") || undefined;
    const search = searchParams.get("search") || searchParams.get("query") || undefined;
    const format = (searchParams.get("format") || "").toLowerCase();

    // Export handler (CSV / JSON stream)
    if (format === "csv") {
      const exportResult = await AuditService.exportAuditLogs(
        { employeeId, performedById, action, module, startDate, endDate, search },
        "csv"
      );
      return new Response(exportResult.data as string, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="audit_logs_${new Date().toISOString().split("T")[0]}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    if (format === "json" && searchParams.get("export") === "true") {
      const exportResult = await AuditService.exportAuditLogs(
        { employeeId, performedById, action, module, startDate, endDate, search },
        "json"
      );
      return NextResponse.json({
        success: true,
        data: exportResult.data,
        count: exportResult.count,
      });
    }

    // Standard paginated fetch
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await AuditService.getAuditLogs({
      employeeId,
      performedById,
      action,
      module,
      startDate,
      endDate,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        logs: result.logs,
        pagination: result.pagination,
      },
      logs: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving compliance audit logs", error);
  }
}

// POST /api/audit
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required to submit audit logs");
    }

    const body = await req.json();
    const action = (body.action || "").toString().trim();
    const module = (body.module || "").toString().trim().toUpperCase();
    const description = (body.description || "").toString().trim();

    if (!action || !module || !description) {
      return ApiResponse.badRequest("action, module, and description are required fields");
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent") || null;

    const logEntry = await AuditService.logEvent({
      employeeId: body.employeeId || null,
      performedById: auth.employee.id,
      action,
      module,
      description,
      ipAddress,
      userAgent,
      metadata: body.metadata || null,
      requestId: body.requestId || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Audit record logged successfully",
        data: { log: logEntry },
      },
      { status: 201 }
    );
  } catch (error) {
    return ApiResponse.serverError("Error logging audit event", error);
  }
}
