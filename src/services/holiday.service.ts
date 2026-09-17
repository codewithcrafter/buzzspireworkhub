import { prisma } from "@/lib/prisma";
import { AuditService } from "./audit.service";

export interface GetHolidaysOptions {
  year?: number;
  date?: string;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateHolidayParams {
  name: string;
  date: Date | string;
  type: string;
  description?: string;
  status?: string;
}

export interface UpdateHolidayParams {
  name?: string;
  date?: Date | string;
  type?: string;
  description?: string | null;
  status?: string;
}

export class HolidayService {
  /**
   * Get paginated & filterable list of holidays.
   */
  static async getHolidays(options: GetHolidaysOptions = {}) {
    const { year, date, type, status, search, page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (type && type !== "ALL") {
      where.type = type;
    }

    if (date) {
      const d = new Date(date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      where.date = { gte: startOfDay, lte: endOfDay };
    } else if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
      where.date = { gte: startOfYear, lte: endOfYear };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ];
    }

    const [holidays, total] = await Promise.all([
      prisma.holiday.findMany({
        where,
        orderBy: { date: "asc" },
        skip,
        take: Math.min(limit, 100),
      }),
      prisma.holiday.count({ where }),
    ]);

    return {
      holidays,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single holiday by ID.
   */
  static async getHolidayById(id: string) {
    const holiday = await prisma.holiday.findUnique({ where: { id } });
    if (!holiday) {
      throw new Error("HOLIDAY_NOT_FOUND");
    }
    return holiday;
  }

  /**
   * Create new holiday with duplicate prevention (same name + same date).
   */
  static async createHoliday(params: CreateHolidayParams, actorId?: string) {
    const name = params.name.trim();
    const date = new Date(params.date);

    if (isNaN(date.getTime())) {
      throw new Error("INVALID_DATE");
    }

    // Check duplicate (same name + date)
    const existing = await prisma.holiday.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });

    if (existing) {
      throw new Error("DUPLICATE_HOLIDAY");
    }

    const holiday = await prisma.$transaction(async (tx) => {
      const created = await tx.holiday.create({
        data: {
          name,
          date: new Date(params.date),
          type: params.type.trim().toUpperCase(),
          description: params.description ? params.description.trim() : null,
          status: params.status || "ACTIVE",
        },
      });

      await AuditService.log({
        employeeId: actorId,
        action: "HOLIDAY_CREATED",
        module: "HOLIDAYS",
        description: `Created holiday ${created.name} on ${created.date.toISOString().split("T")[0]}`,
        metadata: { holidayId: created.id, name: created.name, date: created.date },
      });

      return created;
    });

    return holiday;
  }

  /**
   * Update holiday.
   */
  static async updateHoliday(id: string, params: UpdateHolidayParams, actorId?: string) {
    const existing = await prisma.holiday.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("HOLIDAY_NOT_FOUND");
    }

    const updateData: any = {};
    if (params.name) updateData.name = params.name.trim();
    if (params.date) updateData.date = new Date(params.date);
    if (params.type) updateData.type = params.type.trim().toUpperCase();
    if (params.description !== undefined) updateData.description = params.description;
    if (params.status) updateData.status = params.status;

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.holiday.update({
        where: { id },
        data: updateData,
      });

      await AuditService.log({
        employeeId: actorId,
        action: "HOLIDAY_UPDATED",
        module: "HOLIDAYS",
        description: `Updated holiday ${res.name}`,
        metadata: { holidayId: res.id, changes: updateData },
      });

      return res;
    });

    return updated;
  }

  /**
   * Soft deactivate holiday.
   */
  static async deactivateHoliday(id: string, actorId?: string) {
    const existing = await prisma.holiday.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("HOLIDAY_NOT_FOUND");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.holiday.update({
        where: { id },
        data: { status: "INACTIVE" },
      });

      await AuditService.log({
        employeeId: actorId,
        action: "HOLIDAY_DEACTIVATED",
        module: "HOLIDAYS",
        description: `Deactivated holiday ${res.name}`,
        metadata: { holidayId: res.id },
      });

      return res;
    });

    return updated;
  }

  /**
   * Permanently delete holiday where permitted.
   */
  static async deleteHoliday(id: string, actorId?: string) {
    const existing = await prisma.holiday.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("HOLIDAY_NOT_FOUND");
    }

    const deleted = await prisma.$transaction(async (tx) => {
      const res = await tx.holiday.delete({
        where: { id },
      });

      await AuditService.log({
        employeeId: actorId,
        action: "HOLIDAY_DELETED",
        module: "HOLIDAYS",
        description: `Permanently deleted holiday ${res.name}`,
        metadata: { holidayId: res.id, name: res.name, date: res.date },
      });

      return res;
    });

    return deleted;
  }
}

