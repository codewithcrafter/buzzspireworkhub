import { prisma } from "@/lib/prisma";

// ─── Write (append-only) ──────────────────────────────────────────────────────

export interface LogAuditEventParams {
  employeeId?: string;
  action: string;
  module: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

// ─── Query ────────────────────────────────────────────────────────────────────

export interface AuditLogQueryParams {
  employeeId?: string;
  action?: string;
  module?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export class AuditService {
  /**
   * Appends an immutable security/admin audit record.
   * AuditLog rows must never be modified or deleted.
   */
  static async log(params: LogAuditEventParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          employeeId: params.employeeId || null,
          action: params.action,
          module: params.module,
          description: params.description,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          metadata: params.metadata
            ? JSON.parse(JSON.stringify(params.metadata))
            : undefined,
        },
      });
    } catch (error) {
      // Never throw from a logging utility — fail silently
      console.error("Failed to log audit event:", error);
      return null;
    }
  }

  /**
   * Query audit logs with pagination and filters.
   * READ-ONLY — no mutation allowed.
   */
  static async getLogs(params: AuditLogQueryParams) {
    const {
      employeeId,
      action,
      module,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50,
    } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 200);
    const skip = (safePage - 1) * safeLimit;

    const where: any = {};

    if (employeeId) where.employeeId = employeeId;
    if (action) where.action = action;
    if (module) where.module = module;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { action: { contains: search, mode: "insensitive" } },
        { module: { contains: search, mode: "insensitive" } },
        { ipAddress: { contains: search, mode: "insensitive" } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              fullName: true,
              employeeCode: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Retrieve distinct module and action values for filter dropdowns.
   */
  static async getFilterOptions() {
    const [modules, actions] = await Promise.all([
      prisma.auditLog.findMany({
        select: { module: true },
        distinct: ["module"],
        orderBy: { module: "asc" },
      }),
      prisma.auditLog.findMany({
        select: { action: true },
        distinct: ["action"],
        orderBy: { action: "asc" },
      }),
    ]);

    return {
      modules: modules.map((m) => m.module),
      actions: actions.map((a) => a.action),
    };
  }
}
