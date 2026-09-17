import { prisma } from "@/lib/prisma";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";

export type ValidEmployeeStatus =
  | "ONBOARDING"
  | "PROBATION"
  | "CONFIRMED"
  | "ACTIVE"
  | "RESIGNED"
  | "NOTICE_PERIOD"
  | "EXITED"
  | "SUSPENDED"
  | "TERMINATED"
  | "INACTIVE";

/**
 * Validates whether a state transition is permitted under Phase E rules.
 */
function isValidTransition(current: string, next: string): boolean {
  if (current === next) return true;

  const validTransitions: Record<string, string[]> = {
    ONBOARDING: ["PROBATION", "ACTIVE"],
    PROBATION: ["CONFIRMED", "ACTIVE", "TERMINATED", "RESIGNED"],
    CONFIRMED: ["ACTIVE", "RESIGNED", "NOTICE_PERIOD", "TERMINATED"],
    ACTIVE: ["RESIGNED", "NOTICE_PERIOD", "TERMINATED", "SUSPENDED", "INACTIVE"],
    RESIGNED: ["NOTICE_PERIOD", "EXITED"],
    NOTICE_PERIOD: ["EXITED", "TERMINATED"],
    SUSPENDED: ["ACTIVE", "TERMINATED"],
    INACTIVE: ["ACTIVE"],
    TERMINATED: [],
    EXITED: [],
  };

  const allowed = validTransitions[current as ValidEmployeeStatus];
  return allowed ? allowed.includes(next) : false;
}

export class EmployeeLifecycleService {
  /**
   * Internal helper to close the active EmploymentHistory interval (effectiveTo = now)
   * and create a new interval.
   */
  private static async appendHistory(
    tx: any,
    employeeId: string,
    newStatus: string,
    effectiveDate: Date,
    reason?: string
  ) {
    // Find the latest history record with no effectiveTo
    const activeHistory = await tx.employmentHistory.findFirst({
      where: { employeeId, effectiveTo: null },
      orderBy: { effectiveFrom: "desc" },
    });

    if (activeHistory) {
      if (effectiveDate < activeHistory.effectiveFrom) {
        throw new Error("NEW_HISTORY_DATE_BEFORE_CURRENT_HISTORY");
      }
      // Close existing
      await tx.employmentHistory.update({
        where: { id: activeHistory.id },
        data: { effectiveTo: effectiveDate },
      });
    }

    // Snapshot current state to bring into new history
    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
      select: { departmentId: true, managerId: true, designation: true },
    });

    // Create new
    await tx.employmentHistory.create({
      data: {
        employeeId,
        departmentId: employee.departmentId,
        managerId: employee.managerId,
        designation: employee.designation,
        status: newStatus as any,
        effectiveFrom: effectiveDate,
        reason: reason || null,
      },
    });
  }

  /**
   * Invalidates active login sessions for an employee.
   */
  private static async invalidateSessions(tx: any, employeeId: string) {
    await tx.loginSession.updateMany({
      where: { employeeId, revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Move an employee to PROBATION state.
   */
  static async startProbation(
    employeeId: string,
    probationStart: Date,
    probationEnd?: Date,
    actorId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
      if (!isValidTransition(employee.status, "PROBATION")) {
        throw new Error("INVALID_LIFECYCLE_TRANSITION");
      }
      if (employee.joiningDate && probationStart < employee.joiningDate) {
        throw new Error("PROBATION_START_BEFORE_JOINING_DATE");
      }
      if (probationEnd && probationEnd < probationStart) {
        throw new Error("PROBATION_END_BEFORE_PROBATION_START");
      }

      const updated = await tx.employee.update({
        where: { id: employeeId },
        data: {
          status: "PROBATION",
          probationStart,
          ...(probationEnd ? { probationEnd } : {}),
        },
      });

      await this.appendHistory(tx, employeeId, "PROBATION", probationStart, "Probation started");

      await AuditService.log(
        {
          employeeId: actorId || employeeId,
          action: "EMPLOYEE_PROBATION_STARTED",
          module: "EMPLOYEE_MANAGEMENT",
          description: `Employee ${employee.fullName} probation started`,
          metadata: { targetEmployeeId: employeeId, previousStatus: employee.status, newStatus: "PROBATION" },
        });

      return updated;
    });
  }

  /**
   * Confirm an employee (PROBATION -> CONFIRMED).
   */
  static async confirmEmployee(
    employeeId: string,
    confirmationDate: Date,
    actorId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
      if (!isValidTransition(employee.status, "CONFIRMED")) {
        throw new Error("INVALID_LIFECYCLE_TRANSITION");
      }
      if (employee.joiningDate && confirmationDate < employee.joiningDate) {
        throw new Error("CONFIRMATION_DATE_BEFORE_JOINING_DATE");
      }

      const updated = await tx.employee.update({
        where: { id: employeeId },
        data: {
          status: "CONFIRMED",
          confirmationDate,
        },
      });

      await this.appendHistory(tx, employeeId, "CONFIRMED", confirmationDate, "Employee confirmed");

      await AuditService.log(
        {
          employeeId: actorId || employeeId,
          action: "EMPLOYEE_CONFIRMED",
          module: "EMPLOYEE_MANAGEMENT",
          description: `Employee ${employee.fullName} confirmed`,
          metadata: { targetEmployeeId: employeeId, previousStatus: employee.status, newStatus: "CONFIRMED" },
        });

      return updated;
    });
  }

  /**
   * Record resignation (moves to NOTICE_PERIOD or RESIGNED).
   */
  static async recordResignation(
    employeeId: string,
    resignationDate: Date,
    noticePeriodStart: Date,
    lastWorkingDate: Date,
    reason?: string,
    actorId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
      if (!isValidTransition(employee.status, "NOTICE_PERIOD")) {
        throw new Error("INVALID_LIFECYCLE_TRANSITION");
      }
      if (employee.joiningDate && resignationDate < employee.joiningDate) {
        throw new Error("RESIGNATION_DATE_BEFORE_JOINING_DATE");
      }
      if (noticePeriodStart < resignationDate) {
        throw new Error("NOTICE_PERIOD_START_BEFORE_RESIGNATION_DATE");
      }
      if (lastWorkingDate < noticePeriodStart) {
        throw new Error("LAST_WORKING_DATE_BEFORE_NOTICE_PERIOD_START");
      }

      const updated = await tx.employee.update({
        where: { id: employeeId },
        data: {
          status: "NOTICE_PERIOD",
          resignationDate,
          noticePeriodStart,
          lastWorkingDate,
        },
      });

      await this.appendHistory(tx, employeeId, "NOTICE_PERIOD", noticePeriodStart, reason || "Resigned");

      await AuditService.log(
        {
          employeeId: actorId || employeeId,
          action: "EMPLOYEE_NOTICE_PERIOD_STARTED",
          module: "EMPLOYEE_MANAGEMENT",
          description: `Employee ${employee.fullName} entered notice period`,
          metadata: { targetEmployeeId: employeeId, previousStatus: employee.status, newStatus: "NOTICE_PERIOD" },
        });

      return updated;
    });
  }

  /**
   * Terminate employee.
   */
  static async terminateEmployee(
    employeeId: string,
    exitDate: Date,
    exitReason?: string,
    actorId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
      if (!isValidTransition(employee.status, "TERMINATED")) {
        throw new Error("INVALID_LIFECYCLE_TRANSITION");
      }

      const updated = await tx.employee.update({
        where: { id: employeeId },
        data: {
          status: "TERMINATED",
          exitDate,
          exitReason: exitReason || null,
        },
      });

      await this.invalidateSessions(tx, employeeId);
      await this.appendHistory(tx, employeeId, "TERMINATED", exitDate, exitReason || "Terminated");

      await AuditService.log(
        {
          employeeId: actorId || employeeId,
          action: "EMPLOYEE_TERMINATED",
          module: "EMPLOYEE_MANAGEMENT",
          description: `Employee ${employee.fullName} terminated`,
          metadata: { targetEmployeeId: employeeId, previousStatus: employee.status, newStatus: "TERMINATED" },
        });

      return updated;
    });
  }

  /**
   * Mark employee as EXITED cleanly.
   */
  static async exitEmployee(
    employeeId: string,
    exitDate: Date,
    actorId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
      if (!isValidTransition(employee.status, "EXITED")) {
        throw new Error("INVALID_LIFECYCLE_TRANSITION");
      }

      const updated = await tx.employee.update({
        where: { id: employeeId },
        data: {
          status: "EXITED",
          exitDate,
        },
      });

      await this.invalidateSessions(tx, employeeId);
      await this.appendHistory(tx, employeeId, "EXITED", exitDate, "Exited cleanly");

      await AuditService.log(
        {
          employeeId: actorId || employeeId,
          action: "EMPLOYEE_EXITED",
          module: "EMPLOYEE_MANAGEMENT",
          description: `Employee ${employee.fullName} exited`,
          metadata: { targetEmployeeId: employeeId, previousStatus: employee.status, newStatus: "EXITED" },
        });

      return updated;
    });
  }

  /**
   * Updates EmploymentHistory directly (used when department, manager, or designation changes).
   */
  static async recordAssignmentChange(
    tx: any,
    employeeId: string,
    effectiveDate: Date,
    reason?: string
  ) {
    const employee = await tx.employee.findUnique({ where: { id: employeeId } });
    if (!employee) return;
    await this.appendHistory(tx, employeeId, employee.status, effectiveDate, reason || "Assignment changed");
  }
}
