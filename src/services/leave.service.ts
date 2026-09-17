import { prisma } from "@/lib/prisma";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";
import { NotificationService } from "./notification.service";
import { sendLeaveApprovedEmail, sendLeaveRejectedEmail } from "./email.service";

export interface GetLeavesOptions {
  employeeId?: string;
  departmentId?: string;
  status?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateLeaveParams {
  leaveType: string;
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
}

export class LeaveService {
  /**
   * Calculate leave duration in business days (Calendar-day policy).
   */
  static calculateLeaveDays(startDate: Date, endDate: Date): number {
    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs < 0) {
      throw new Error("INVALID_DATE_RANGE");
    }
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, days);
  }

  /**
   * Get paginated leave requests with authorization restrictions.
   */
  static async getLeaves(options: GetLeavesOptions = {}, currentUserId: string, currentUserRole: string, currentUserDepartmentId?: string | null) {
    const { employeeId, departmentId, status, leaveType, startDate, endDate, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (currentUserRole === "EMPLOYEE") {
      where.employeeId = currentUserId;
    } else if (employeeId) {
      where.employeeId = employeeId;
    }

    if (currentUserRole === "MANAGER" && currentUserDepartmentId) {
      // Force department scope for MANAGER
      where.employee = { departmentId: currentUserDepartmentId };
    } else if (departmentId) {
      // Let ADMIN / HR_MANAGER filter by department
      where.employee = { departmentId };
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (leaveType && leaveType !== "ALL") {
      where.leaveType = leaveType;
    }

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }

    const [leaves, total] = await Promise.all([
      prisma.leave.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Math.min(limit, 100),
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              fullName: true,
              email: true,
              designation: true,
              department: { select: { name: true } },
            },
          },
          reviewer: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.leave.count({ where }),
    ]);

    const formatted = leaves.map((l) => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employee.fullName,
      employeeCode: l.employee.employeeId,
      department: l.employee.department?.name || "General",
      designation: l.employee.designation,
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      totalDays: l.totalDays,
      reason: l.reason,
      status: l.status,
      rejectionReason: l.rejectionReason,
      reviewedBy: l.reviewer?.fullName || null,
      reviewedAt: l.reviewedAt,
      createdAt: l.createdAt,
    }));

    return {
      leaves: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single leave details.
   */
  static async getLeaveById(id: string, currentUserId: string, currentUserRole: string) {
    const leave = await prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            fullName: true,
            email: true,
            department: { select: { name: true } },
          },
        },
        reviewer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!leave) {
      throw new Error("LEAVE_NOT_FOUND");
    }

    if (currentUserRole === "EMPLOYEE" && leave.employeeId !== currentUserId) {
      throw new Error("FORBIDDEN");
    }

    return leave;
  }

  /**
   * Submit new leave request.
   */
  static async createLeave(params: CreateLeaveParams, employeeId: string) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      throw new Error("INVALID_DATE_RANGE");
    }

    // Check for overlapping pending or approved leave
    const overlapping = await prisma.leave.findFirst({
      where: {
        employeeId,
        status: { in: ["APPROVED", "PENDING"] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlapping) {
      throw new Error("OVERLAPPING_LEAVE_EXISTS");
    }

    const totalDays = this.calculateLeaveDays(start, end);

    const leave = await prisma.$transaction(async (tx) => {
      const created = await tx.leave.create({
        data: {
          employeeId,
          leaveType: params.leaveType.trim().toUpperCase(),
          startDate: start,
          endDate: end,
          totalDays,
          reason: params.reason.trim(),
          status: "PENDING",
        },
        include: {
          employee: { select: { fullName: true } },
        },
      });

      await AuditService.log({
        employeeId,
        action: "LEAVE_APPLIED",
        module: "LEAVES",
        description: `Applied for ${totalDays} day(s) ${created.leaveType} leave`,
        metadata: { leaveId: created.id, leaveType: created.leaveType, totalDays },
      });

      await ActivityService.log({
        employeeId,
        action: "LEAVE_APPLIED",
        module: "LEAVES",
        description: `Submitted ${created.leaveType} leave request for ${totalDays} day(s)`,
        metadata: { leaveId: created.id },
      });

      return created;
    });

    return leave;
  }

  /**
   * Approve pending leave request with notifications and email triggers.
   */
  static async approveLeave(leaveId: string, reviewerId: string) {
    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      include: { employee: true },
    });

    if (!leave) {
      throw new Error("LEAVE_NOT_FOUND");
    }

    if (leave.employeeId === reviewerId) {
      throw new Error("CANNOT_APPROVE_OWN_LEAVE");
    }

    if (leave.status !== "PENDING") {
      throw new Error("INVALID_LEAVE_STATE");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.leave.update({
        where: { id: leaveId },
        data: {
          status: "APPROVED",
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        },
      });

      await AuditService.log({
        employeeId: reviewerId,
        action: "LEAVE_APPROVED",
        module: "LEAVES",
        description: `Approved leave request #${leaveId}`,
        metadata: { leaveId, targetEmployeeId: leave.employeeId },
      });

      await ActivityService.log({
        employeeId: leave.employeeId,
        action: "LEAVE_APPROVED",
        module: "LEAVES",
        description: `Leave request for ${leave.totalDays} day(s) was approved`,
        metadata: { leaveId },
      });

      return res;
    });

    // Create database notification (non-blocking after DB commit)
    try {
      await NotificationService.createNotification({
        employeeId: leave.employeeId,
        type: "LEAVE_APPROVED",
        title: "Leave Request Approved",
        message: `Your ${leave.leaveType} leave request for ${leave.totalDays} day(s) has been approved.`,
        metadata: { leaveId: leave.id },
      });
    } catch (err) {
      console.error("[Notification Error] Failed to create leave approval notification:", err);
    }

    // Trigger email workflow (non-blocking)
    if (leave.employee) {
      sendLeaveApprovedEmail(leave, leave.employee).catch(() => {});
    }

    return updated;
  }

  /**
   * Reject pending leave request with notifications and email triggers.
   */
  static async rejectLeave(leaveId: string, reviewerId: string, rejectionReason?: string) {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new Error("REJECTION_REASON_REQUIRED");
    }

    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      include: { employee: true },
    });

    if (!leave) {
      throw new Error("LEAVE_NOT_FOUND");
    }

    if (leave.employeeId === reviewerId) {
      throw new Error("CANNOT_REJECT_OWN_LEAVE");
    }

    if (leave.status !== "PENDING") {
      throw new Error("INVALID_LEAVE_STATE");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.leave.update({
        where: { id: leaveId },
        data: {
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        },
      });

      await AuditService.log({
        employeeId: reviewerId,
        action: "LEAVE_REJECTED",
        module: "LEAVES",
        description: `Rejected leave request #${leaveId}: ${rejectionReason.trim()}`,
        metadata: { leaveId, rejectionReason: rejectionReason.trim() },
      });

      await ActivityService.log({
        employeeId: leave.employeeId,
        action: "LEAVE_REJECTED",
        module: "LEAVES",
        description: `Leave request for ${leave.totalDays} day(s) was rejected`,
        metadata: { leaveId, rejectionReason: rejectionReason.trim() },
      });

      return res;
    });

    // Create database notification (non-blocking after DB commit)
    try {
      await NotificationService.createNotification({
        employeeId: leave.employeeId,
        type: "LEAVE_REJECTED",
        title: "Leave Request Rejected",
        message: `Your ${leave.leaveType} leave request for ${leave.totalDays} day(s) was rejected. Reason: ${rejectionReason.trim()}`,
        metadata: { leaveId: leave.id },
      });
    } catch (err) {
      console.error("[Notification Error] Failed to create leave rejection notification:", err);
    }

    // Trigger email workflow (non-blocking)
    if (leave.employee) {
      sendLeaveRejectedEmail(leave, leave.employee, rejectionReason.trim()).catch(() => {});
    }

    return updated;
  }

  /**
   * Cancel pending leave request by employee.
   */
  static async cancelLeave(leaveId: string, employeeId: string, isUserAdmin: boolean = false) {
    const leave = await prisma.leave.findUnique({ where: { id: leaveId } });
    if (!leave) {
      throw new Error("LEAVE_NOT_FOUND");
    }

    if (!isUserAdmin && leave.employeeId !== employeeId) {
      throw new Error("FORBIDDEN");
    }

    if (leave.status !== "PENDING") {
      throw new Error("CANNOT_CANCEL_FINALIZED_LEAVE");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.leave.update({
        where: { id: leaveId },
        data: { status: "CANCELLED" },
      });

      await AuditService.log({
        employeeId,
        action: "LEAVE_CANCELLED",
        module: "LEAVES",
        description: `Cancelled pending leave request #${leaveId}`,
        metadata: { leaveId },
      });

      return res;
    });

    try {
      await NotificationService.createNotification({
        employeeId: leave.employeeId,
        type: "LEAVE_CANCELLED",
        title: "Leave Request Cancelled",
        message: `Your pending ${leave.leaveType} leave request has been cancelled.`,
        metadata: { leaveId: leave.id },
      });
    } catch (err) {
      console.error("[Notification Error] Failed to create leave cancellation notification:", err);
    }

    return updated;
  }
}
