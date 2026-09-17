import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";

export interface GetEmployeesOptions {
  search?: string;
  departmentId?: string;
  departmentCode?: string;
  roleId?: string;
  roleName?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateEmployeeParams {
  employeeId?: string;
  employeeCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  roleId: string;
  departmentId?: string;
  designation?: string;
  joiningDate?: Date | string;
  shiftStart?: string;
  shiftEnd?: string;
  hourlyRate?: number;
  monthlySalary?: number;
  avatar?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface UpdateEmployeeParams {
  fullName?: string;
  email?: string;
  phone?: string | null;
  roleId?: string;
  departmentId?: string | null;
  designation?: string | null;
  joiningDate?: Date | string | null;
  shiftStart?: string | null;
  shiftEnd?: string | null;
  hourlyRate?: number | null;
  monthlySalary?: number | null;
  avatar?: string | null;
  managerId?: string | null;
}

export class EmployeeService {
  /**
   * Sanitizes an employee object to exclude password hashes and sensitive security tokens.
   */
  static sanitizeEmployee(employee: any) {
    if (!employee) return null;
    const {
      passwordHash,
      passwordResetToken,
      passwordResetExpiry,
      failedLoginAttempts,
      lockedUntil,
      user,
      ...safe
    } = employee;

    return {
      id: safe.id,
      employeeId: safe.employeeId,
      employeeCode: safe.employeeCode,
      fullName: safe.fullName,
      email: safe.email,
      phone: safe.phone,
      role: safe.role?.name || safe.roleId,
      roleDetails: safe.role ? { id: safe.role.id, name: safe.role.name, description: safe.role.description } : null,
      department: safe.department?.name || null,
      departmentDetails: safe.department ? { id: safe.department.id, code: safe.department.code, name: safe.department.name } : null,
      designation: safe.designation,
      joiningDate: safe.joiningDate,
      shiftStart: safe.shiftStart,
      shiftEnd: safe.shiftEnd,
      hourlyRate: safe.hourlyRate,
      monthlySalary: safe.monthlySalary,
      avatar: safe.avatar,
      status: safe.status,
      lastLoginAt: safe.lastLoginAt,
      createdAt: safe.createdAt,
      updatedAt: safe.updatedAt,
    };
  }

  /**
   * Auto-generates the next sequential Employee ID (e.g. EMP-1001, EMP-1002).
   */
  static async generateNextEmployeeId(): Promise<{ employeeId: string; employeeCode: string }> {
    const latest = await prisma.employee.findFirst({
      where: { employeeId: { startsWith: "EMP-" } },
      orderBy: { createdAt: "desc" },
      select: { employeeId: true },
    });

    let nextNum = 1001;
    if (latest?.employeeId) {
      const match = latest.employeeId.match(/^EMP-(\d+)$/i);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    const employeeId = `EMP-${nextNum}`;
    const employeeCode = `EMP${nextNum}`;
    return { employeeId, employeeCode };
  }

  /**
   * Retrieves paginated and filtered employees list.
   */
  static async getEmployees(options: GetEmployeesOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options.status && options.status !== "ALL") {
      where.status = options.status as any;
    }

    if (options.departmentId) {
      where.departmentId = options.departmentId;
    }

    if (options.departmentCode) {
      where.department = { code: options.departmentCode };
    }

    if (options.roleId) {
      where.roleId = options.roleId;
    }

    if (options.roleName && options.roleName !== "ALL") {
      where.role = { name: options.roleName as any };
    }

    if (options.search?.trim()) {
      const search = options.search.trim();
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
        { employeeCode: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, employees] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          role: true,
          department: true,
        },
      }),
    ]);

    const sanitized = employees.map(EmployeeService.sanitizeEmployee);

    return {
      employees: sanitized,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Finds an employee by database primary ID.
   */
  static async getEmployeeById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        role: true,
        department: true,
      },
    });
    return EmployeeService.sanitizeEmployee(employee);
  }

  /**
   * Finds an employee by string employeeId (e.g. EMP-1001).
   */
  static async getEmployeeByEmployeeId(employeeId: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { employeeId: { equals: employeeId, mode: "insensitive" } },
          { employeeCode: { equals: employeeId, mode: "insensitive" } },
          { email: { equals: employeeId.toLowerCase(), mode: "insensitive" } },
        ],
      },
      include: {
        role: true,
        department: true,
      },
    });
    return EmployeeService.sanitizeEmployee(employee);
  }

  /**
   * Finds raw employee record with passwordHash (for internal auth validation only).
   */
  static async findByIdentifier(identifier: string) {
    const trimmed = identifier.trim();
    return prisma.employee.findFirst({
      where: {
        OR: [
          { email: trimmed.toLowerCase() },
          { employeeId: trimmed },
          { employeeCode: trimmed },
        ],
      },
      include: {
        role: true,
        department: true,
      },
    });
  }

  /**
   * Creates a new Employee record in the database.
   */
  static async createEmployee(params: CreateEmployeeParams, actorId?: string) {
    const email = params.email.trim().toLowerCase();

    // 1. Check unique email
    const existingEmail = await prisma.employee.findUnique({ where: { email } });
    if (existingEmail) {
      throw new Error("EMPLOYEE_EMAIL_EXISTS");
    }

    // 2. Validate role
    const roleRecord = await prisma.role.findUnique({ where: { id: params.roleId } });
    if (!roleRecord) {
      throw new Error("ROLE_NOT_FOUND");
    }

    // 3. Validate department if provided
    if (params.departmentId) {
      const deptRecord = await prisma.department.findUnique({ where: { id: params.departmentId } });
      if (!deptRecord) {
        throw new Error("DEPARTMENT_NOT_FOUND");
      }
    }

    // 4. Generate or check employeeId / employeeCode
    let empId = params.employeeId?.trim().toUpperCase();
    let empCode = params.employeeCode?.trim().toUpperCase();

    if (!empId) {
      const generated = await EmployeeService.generateNextEmployeeId();
      empId = generated.employeeId;
      empCode = generated.employeeCode;
    } else {
      empCode = empCode || empId.replace("-", "");
      const existingCode = await prisma.employee.findFirst({
        where: { OR: [{ employeeId: empId }, { employeeCode: empCode }] },
      });
      if (existingCode) {
        throw new Error("EMPLOYEE_ID_EXISTS");
      }
    }

    // 5. Hash password
    const rawPassword = params.password || "BuzzSpire@2026";
    const passwordHash = await hashPassword(rawPassword);

    // 6. Create Employee
    const newEmployee = await prisma.$transaction(async (tx) => {
      const emp = await tx.employee.create({
        data: {
          employeeId: empId,
          employeeCode: empCode,
          fullName: params.fullName.trim(),
          email,
          phone: params.phone?.trim() || null,
          passwordHash,
          roleId: params.roleId,
          departmentId: params.departmentId || null,
          designation: params.designation?.trim() || null,
          joiningDate: params.joiningDate ? new Date(params.joiningDate) : new Date(),
          shiftStart: params.shiftStart || "09:00",
          shiftEnd: params.shiftEnd || "18:00",
          hourlyRate: params.hourlyRate || null,
          monthlySalary: params.monthlySalary || null,
          avatar: params.avatar || null,
          status: params.status || "ACTIVE",
        },
        include: {
          role: true,
          department: true,
        },
      });

      const { EmployeeLifecycleService } = require("./employee-lifecycle.service");
      await EmployeeLifecycleService.recordAssignmentChange(tx, emp.id, new Date(), "Initial assignment");

      return emp;
    });

    // 7. Audit & Activity Logging
    await AuditService.log({
      employeeId: actorId || newEmployee.id,
      action: "EMPLOYEE_CREATED",
      module: "EMPLOYEE_MANAGEMENT",
      description: `Created new employee: ${newEmployee.fullName} (${newEmployee.employeeId})`,
      metadata: { createdEmployeeId: newEmployee.id, role: newEmployee.role.name },
    });

    await ActivityService.log({
      employeeId: actorId || newEmployee.id,
      action: "EMPLOYEE_CREATED",
      module: "EMPLOYEES",
      description: `New employee ${newEmployee.fullName} added to the system`,
    });

    return EmployeeService.sanitizeEmployee(newEmployee);
  }

  /**
   * Updates an existing Employee record.
   */
  static async updateEmployee(id: string, params: UpdateEmployeeParams, actorId?: string) {
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("EMPLOYEE_NOT_FOUND");
    }

    // Check unique email if changing
    if (params.email && params.email.trim().toLowerCase() !== existing.email) {
      const emailConflict = await prisma.employee.findUnique({
        where: { email: params.email.trim().toLowerCase() },
      });
      if (emailConflict) {
        throw new Error("EMPLOYEE_EMAIL_EXISTS");
      }
    }

    // Validate role if changing
    if (params.roleId && params.roleId !== existing.roleId) {
      const roleExists = await prisma.role.findUnique({ where: { id: params.roleId } });
      if (!roleExists) {
        throw new Error("ROLE_NOT_FOUND");
      }
    }

    // Validate department if changing
    if (params.departmentId && params.departmentId !== existing.departmentId) {
      const deptExists = await prisma.department.findUnique({ where: { id: params.departmentId } });
      if (!deptExists) {
        throw new Error("DEPARTMENT_NOT_FOUND");
      }
    }

    const hasAssignmentChanged = 
      (params.departmentId !== undefined && params.departmentId !== existing.departmentId) ||
      (params.managerId !== undefined && params.managerId !== existing.managerId) ||
      (params.designation !== undefined && params.designation !== existing.designation);

    const updated = await prisma.$transaction(async (tx) => {
      const emp = await tx.employee.update({
        where: { id },
        data: {
          ...(params.fullName !== undefined ? { fullName: params.fullName.trim() } : {}),
          ...(params.email !== undefined ? { email: params.email.trim().toLowerCase() } : {}),
          ...(params.phone !== undefined ? { phone: params.phone ? params.phone.trim() : null } : {}),
          ...(params.roleId !== undefined ? { roleId: params.roleId } : {}),
          ...(params.departmentId !== undefined ? { departmentId: params.departmentId } : {}),
          ...(params.managerId !== undefined ? { managerId: params.managerId } : {}),
          ...(params.designation !== undefined ? { designation: params.designation ? params.designation.trim() : null } : {}),
          ...(params.joiningDate !== undefined ? { joiningDate: params.joiningDate ? new Date(params.joiningDate) : null } : {}),
          ...(params.shiftStart !== undefined ? { shiftStart: params.shiftStart } : {}),
          ...(params.shiftEnd !== undefined ? { shiftEnd: params.shiftEnd } : {}),
          ...(params.hourlyRate !== undefined ? { hourlyRate: params.hourlyRate } : {}),
          ...(params.monthlySalary !== undefined ? { monthlySalary: params.monthlySalary } : {}),
          ...(params.avatar !== undefined ? { avatar: params.avatar } : {}),
        },
        include: {
          role: true,
          department: true,
        },
      });

      if (hasAssignmentChanged) {
        const { EmployeeLifecycleService } = require("./employee-lifecycle.service");
        await EmployeeLifecycleService.recordAssignmentChange(tx, id, new Date(), "Employee profile updated");
      }
      return emp;
    });

    await AuditService.log({
      employeeId: actorId || id,
      action: "EMPLOYEE_UPDATED",
      module: "EMPLOYEE_MANAGEMENT",
      description: `Updated employee profile for: ${updated.fullName} (${updated.employeeId})`,
      metadata: { targetEmployeeId: id },
    });

    await ActivityService.log({
      employeeId: actorId || id,
      action: "EMPLOYEE_UPDATED",
      module: "EMPLOYEES",
      description: `Updated profile details for ${updated.fullName}`,
    });

    return EmployeeService.sanitizeEmployee(updated);
  }

  /**
   * Soft-deactivates an employee account (status = INACTIVE).
   * Historical attendance records are preserved.
   */
  static async deactivateEmployee(id: string, actorId?: string) {
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("EMPLOYEE_NOT_FOUND");
    }

    const deactivated = await prisma.employee.update({
      where: { id },
      data: { status: "INACTIVE" },
      include: { role: true, department: true },
    });

    await AuditService.log({
      employeeId: actorId || id,
      action: "EMPLOYEE_DEACTIVATED",
      module: "EMPLOYEE_MANAGEMENT",
      description: `Deactivated employee account: ${deactivated.fullName} (${deactivated.employeeId})`,
      metadata: { targetEmployeeId: id },
    });

    await ActivityService.log({
      employeeId: actorId || id,
      action: "EMPLOYEE_DEACTIVATED",
      module: "EMPLOYEES",
      description: `Deactivated employee ${deactivated.fullName}`,
    });

    return EmployeeService.sanitizeEmployee(deactivated);
  }

  /**
   * Re-activates an employee account (status = ACTIVE).
   */
  static async activateEmployee(id: string, actorId?: string) {
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("EMPLOYEE_NOT_FOUND");
    }

    const activated = await prisma.employee.update({
      where: { id },
      data: { status: "ACTIVE" },
      include: { role: true, department: true },
    });

    await AuditService.log({
      employeeId: actorId || id,
      action: "EMPLOYEE_ACTIVATED",
      module: "EMPLOYEE_MANAGEMENT",
      description: `Activated employee account: ${activated.fullName} (${activated.employeeId})`,
      metadata: { targetEmployeeId: id },
    });

    return EmployeeService.sanitizeEmployee(activated);
  }

  /**
   * Updates last login timestamp and clears failed attempts.
   */
  static async updateLastLogin(id: string) {
    return prisma.employee.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Increments failed login count and locks account for 15 mins if 5 attempts reached.
   */
  static async recordFailedAttempt(id: string, currentAttempts: number) {
    const maxAttempts = 5;
    const newAttempts = currentAttempts + 1;
    let lockedUntil: Date | null = null;

    if (newAttempts >= maxAttempts) {
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await prisma.employee.update({
      where: { id },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil,
      },
    });

    return { attempts: newAttempts, isLocked: !!lockedUntil, lockedUntil };
  }
}
