import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface LogAuditEventInput {
  employeeId?: string | null;
  performedById?: string | null;
  action: string;
  module: string;
  description: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  requestId?: string | null;
}

export interface AuditLogQueryFilters {
  employeeId?: string;
  performedById?: string;
  action?: string;
  module?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  searchQuery?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type AuditExportFormat = "csv" | "json";

// ─── Service Implementation ──────────────────────────────────────────────────

export class AuditService {
  /**
   * Appends an immutable security and compliance audit record.
   * If a Prisma transaction client (`tx`) is provided, commits atomically with the transaction.
   * If called outside a transaction, executes asynchronously to minimize latency without blocking caller responses.
   * Fails safely and never throws to prevent disruption to core business flows.
   */
  static async logEvent(
    data: LogAuditEventInput,
    tx?: Prisma.TransactionClient
  ) {
    const serializedMetadata = data.metadata
      ? JSON.parse(JSON.stringify(data.metadata))
      : undefined;

    const payload: Prisma.AuditLogCreateInput = {
      action: data.action.trim(),
      module: data.module.trim().toUpperCase(),
      description: data.description.trim(),
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      metadata: serializedMetadata,
      requestId: data.requestId || null,
    };

    if (data.employeeId) {
      payload.employee = { connect: { id: data.employeeId } };
    }

    if (data.performedById) {
      payload.performedBy = { connect: { id: data.performedById } };
    }

    // Atomic execution within active database transaction
    if (tx) {
      try {
        return await tx.auditLog.create({ data: payload });
      } catch (error) {
        console.error("[AuditService] Atomic transaction audit write failed:", error);
        return null;
      }
    }

    // Direct / non-transactional execution
    try {
      return await prisma.auditLog.create({ data: payload });
    } catch (error) {
      console.error("[AuditService] Non-blocking audit write failed:", error);
      return null;
    }
  }

  /**
   * Legacy wrapper for backward compatibility with existing callers.
   */
  static async log(params: {
    employeeId?: string;
    action: string;
    module: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
    performedById?: string;
  }) {
    return AuditService.logEvent({
      employeeId: params.employeeId,
      performedById: params.performedById,
      action: params.action,
      module: params.module,
      description: params.description,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata,
    });
  }

  /**
   * Builds a optimized Prisma WHERE clause leveraging composite indexes.
   */
  private static buildWhereClause(filters: AuditLogQueryFilters): Prisma.AuditLogWhereInput {
    const where: Prisma.AuditLogWhereInput = {};

    if (filters.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters.performedById) {
      where.performedById = filters.performedById;
    }

    if (filters.action && filters.action !== "ALL") {
      where.action = filters.action;
    }

    if (filters.module && filters.module !== "ALL") {
      where.module = filters.module.toUpperCase();
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        const start = typeof filters.startDate === "string" ? new Date(filters.startDate) : filters.startDate;
        if (!isNaN(start.getTime())) {
          where.createdAt.gte = start;
        }
      }
      if (filters.endDate) {
        const end = typeof filters.endDate === "string" ? new Date(filters.endDate) : filters.endDate;
        if (!isNaN(end.getTime())) {
          where.createdAt.lte = end;
        }
      }
    }

    const term = (filters.searchQuery || filters.search || "").trim();
    if (term) {
      where.OR = [
        { description: { contains: term, mode: "insensitive" } },
        { action: { contains: term, mode: "insensitive" } },
        { module: { contains: term, mode: "insensitive" } },
        { ipAddress: { contains: term, mode: "insensitive" } },
        { employee: { fullName: { contains: term, mode: "insensitive" } } },
        { employee: { employeeCode: { contains: term, mode: "insensitive" } } },
        { performedBy: { fullName: { contains: term, mode: "insensitive" } } },
      ];
    }

    return where;
  }

  /**
   * Retrieves paginated audit logs with dynamic filtering.
   * Joined with target employee and actor (performedBy) relations.
   */
  static async getAuditLogs(filters: AuditLogQueryFilters) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(Math.max(1, filters.limit || 50), 200);
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              fullName: true,
              employeeCode: true,
              department: { select: { id: true, name: true, code: true } },
            },
          },
          performedBy: {
            select: {
              id: true,
              employeeId: true,
              fullName: true,
              employeeCode: true,
              role: { select: { name: true } },
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
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Legacy alias for backward compatibility.
   */
  static async getLogs(params: AuditLogQueryFilters) {
    return AuditService.getAuditLogs(params);
  }

  /**
   * Exports audit logs in standard CSV or structured JSON format for compliance audits.
   */
  static async exportAuditLogs(filters: AuditLogQueryFilters, format: AuditExportFormat = "json") {
    const where = this.buildWhereClause(filters);
    const exportLimit = 10000; // Safeguard against OOM on massive enterprise histories

    const logs = await prisma.auditLog.findMany({
      where,
      take: exportLimit,
      orderBy: { createdAt: "desc" },
      include: {
        employee: {
          select: {
            employeeCode: true,
            fullName: true,
          },
        },
        performedBy: {
          select: {
            employeeCode: true,
            fullName: true,
          },
        },
      },
    });

    if (format === "json") {
      return {
        format: "json",
        data: logs,
        count: logs.length,
      };
    }

    // CSV format generation
    const headers = [
      "Log ID",
      "Timestamp (UTC)",
      "Module",
      "Action",
      "Description",
      "Target Employee",
      "Performed By",
      "IP Address",
      "User Agent",
      "Metadata",
    ];

    const escapeCsvField = (field: unknown): string => {
      if (field === null || field === undefined) return '""';
      const str = typeof field === "object" ? JSON.stringify(field) : String(field);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = logs.map((log) => [
      escapeCsvField(log.id),
      escapeCsvField(log.createdAt.toISOString()),
      escapeCsvField(log.module),
      escapeCsvField(log.action),
      escapeCsvField(log.description),
      escapeCsvField(log.employee ? `${log.employee.fullName} (${log.employee.employeeCode})` : "System / Unspecified"),
      escapeCsvField(log.performedBy ? `${log.performedBy.fullName} (${log.performedBy.employeeCode})` : "System Automated"),
      escapeCsvField(log.ipAddress || "N/A"),
      escapeCsvField(log.userAgent || "N/A"),
      escapeCsvField(log.metadata ? JSON.stringify(log.metadata) : "{}"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return {
      format: "csv",
      data: csvContent,
      count: logs.length,
    };
  }

  /**
   * Retrieve distinct module and action values for audit filter dropdowns.
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
