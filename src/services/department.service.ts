import { prisma } from "@/lib/prisma";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";

export interface GetDepartmentsOptions {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateDepartmentParams {
  code: string;
  name: string;
  manager?: string;
  status?: string;
}

export interface UpdateDepartmentParams {
  code?: string;
  name?: string;
  manager?: string | null;
  status?: string;
}

export class DepartmentService {
  /**
   * Get paginated & filterable department list with active employee counts.
   */
  static async getDepartments(options: GetDepartmentsOptions = {}) {
    const { search, status, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { manager: { contains: search, mode: "insensitive" } },
      ];
    }

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: Math.min(limit, 100),
        include: {
          _count: {
            select: { employees: true },
          },
        },
      }),
      prisma.department.count({ where }),
    ]);

    const formatted = departments.map((dept) => ({
      id: dept.id,
      code: dept.code,
      name: dept.name,
      manager: dept.manager || "Unassigned",
      status: dept.status,
      employeeCount: dept._count.employees,
      createdAt: dept.createdAt,
      updatedAt: dept.updatedAt,
    }));

    return {
      departments: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single department by ID with active employee roster.
   */
  static async getDepartmentById(id: string) {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            id: true,
            employeeId: true,
            fullName: true,
            email: true,
            designation: true,
            status: true,
          },
        },
        _count: {
          select: { employees: true },
        },
      },
    });

    if (!department) {
      throw new Error("DEPARTMENT_NOT_FOUND");
    }

    return {
      id: department.id,
      code: department.code,
      name: department.name,
      manager: department.manager || "Unassigned",
      status: department.status,
      employeeCount: department._count.employees,
      employees: department.employees,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }

  /**
   * Create new department.
   */
  static async createDepartment(params: CreateDepartmentParams, actorId?: string) {
    const code = params.code.trim().toUpperCase();
    const name = params.name.trim();

    // Check duplicate code or name
    const existing = await prisma.department.findFirst({
      where: {
        OR: [{ code }, { name: { equals: name, mode: "insensitive" } }],
      },
    });

    if (existing) {
      throw new Error("DUPLICATE_DEPARTMENT");
    }

    const department = await prisma.$transaction(async (tx) => {
      const created = await tx.department.create({
        data: {
          code,
          name,
          manager: params.manager || null,
          status: params.status || "ACTIVE",
        },
      });

      await AuditService.log({
        employeeId: actorId,
        action: "DEPARTMENT_CREATED",
        module: "DEPARTMENTS",
        description: `Created department ${created.name} (${created.code})`,
        metadata: { departmentId: created.id, code: created.code, name: created.name },
      });

      await ActivityService.log({
        employeeId: actorId,
        action: "DEPARTMENT_CREATED",
        module: "DEPARTMENTS",
        description: `Created new department ${created.name}`,
        metadata: { departmentId: created.id },
      });

      return created;
    });

    return department;
  }

  /**
   * Update department.
   */
  static async updateDepartment(id: string, params: UpdateDepartmentParams, actorId?: string) {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("DEPARTMENT_NOT_FOUND");
    }

    const updateData: any = {};
    if (params.code) updateData.code = params.code.trim().toUpperCase();
    if (params.name) updateData.name = params.name.trim();
    if (params.manager !== undefined) updateData.manager = params.manager;
    if (params.status) updateData.status = params.status;

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.department.update({
        where: { id },
        data: updateData,
      });

      await AuditService.log({
        employeeId: actorId,
        action: "DEPARTMENT_UPDATED",
        module: "DEPARTMENTS",
        description: `Updated department ${res.name}`,
        metadata: { departmentId: res.id, changes: updateData },
      });

      return res;
    });

    return updated;
  }

  /**
   * Deactivate department with active employee assignment protection.
   */
  static async deactivateDepartment(id: string, actorId?: string) {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            employees: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    });

    if (!department) {
      throw new Error("DEPARTMENT_NOT_FOUND");
    }

    // Protection check: Cannot deactivate if active employees are assigned
    if (department._count.employees > 0) {
      throw new Error("DEPARTMENT_HAS_EMPLOYEES");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.department.update({
        where: { id },
        data: { status: "INACTIVE" },
      });

      await AuditService.log({
        employeeId: actorId,
        action: "DEPARTMENT_DEACTIVATED",
        module: "DEPARTMENTS",
        description: `Deactivated department ${res.name}`,
        metadata: { departmentId: res.id },
      });

      return res;
    });

    return updated;
  }

  /**
   * Activate department.
   */
  static async activateDepartment(id: string, actorId?: string) {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("DEPARTMENT_NOT_FOUND");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.department.update({
        where: { id },
        data: { status: "ACTIVE" },
      });

      await AuditService.log({
        employeeId: actorId,
        action: "DEPARTMENT_ACTIVATED",
        module: "DEPARTMENTS",
        description: `Activated department ${res.name}`,
        metadata: { departmentId: res.id },
      });

      return res;
    });

    return updated;
  }
}
