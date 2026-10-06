import { prisma } from "@/lib/prisma";
import { Prisma, ODStatus, ODSessionType } from "@prisma/client";
import { getStartOfDay, getEndOfDay, getKolkataDateString, calculateDurationSeconds } from "@/lib/date";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";
import { HREngineService } from "./hr-engine.service";
import { EmployeeService } from "./employee.service";

export interface CreateODRequestInput {
  employeeId: string;
  date: string | Date;
  sessionType?: ODSessionType;
  reason: string;
  location?: string | null;
  actorId?: string;
}

export interface ODFilterOptions {
  status?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class OnDutyService {
  /**
   * Generates a sequential human-readable OD identifier: OD-YYYYMMDD-XXXX
   */
  static async generateODId(tx: Prisma.TransactionClient, date: Date): Promise<string> {
    const kolkataStr = getKolkataDateString(date); // YYYY-MM-DD
    const dateFormatted = kolkataStr.replace(/-/g, ""); // YYYYMMDD
    const prefix = `OD-${dateFormatted}-`;

    const count = await tx.onDutyRequest.count({
      where: {
        odId: { startsWith: prefix },
      },
    });

    let sequence = count + 1;
    let candidate = `${prefix}${String(sequence).padStart(4, "0")}`;

    while (await tx.onDutyRequest.findUnique({ where: { odId: candidate } })) {
      sequence++;
      candidate = `${prefix}${String(sequence).padStart(4, "0")}`;
    }

    return candidate;
  }

  /**
   * Submits a new On Duty (OD) request for an employee.
   */
  static async createODRequest(data: CreateODRequestInput) {
    const rawDate = data.date instanceof Date ? data.date : new Date(data.date);
    if (isNaN(rawDate.getTime())) {
      throw new Error("INVALID_DATE");
    }

    const targetDate = getStartOfDay(rawDate);
    const sessionType: ODSessionType = data.sessionType || "FULL_DAY";

    if (!data.reason || !data.reason.trim()) {
      throw new Error("REASON_REQUIRED");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Verify employee exists and is eligible
      const employee = await tx.employee.findUnique({
        where: { id: data.employeeId },
        select: {
          id: true,
          fullName: true,
          status: true,
          lastWorkingDate: true,
          role: { select: { name: true } },
        },
      });

      if (!employee) {
        throw new Error("EMPLOYEE_NOT_FOUND");
      }

      if (!EmployeeService.isEligibleForAttendance(employee.status)) {
        throw new Error("EMPLOYEE_NOT_ACTIVE");
      }

      if (employee.lastWorkingDate && targetDate > getStartOfDay(employee.lastWorkingDate)) {
        throw new Error("BEYOND_LAST_WORKING_DATE");
      }

      // Max future limit: cannot apply more than 30 days in advance
      const maxFutureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      if (targetDate > maxFutureDate) {
        throw new Error("FUTURE_DATE_LIMIT_EXCEEDED");
      }

      // 2. Prevent overlapping / duplicate pending or approved OD requests for the same date
      const existingODs = await tx.onDutyRequest.findMany({
        where: {
          employeeId: data.employeeId,
          date: targetDate,
          status: { in: ["PENDING", "APPROVED"] },
        },
      });

      if (existingODs.length > 0) {
        const hasFullDay = existingODs.some((od) => od.sessionType === "FULL_DAY");
        if (hasFullDay || sessionType === "FULL_DAY") {
          throw new Error("OD_REQUEST_OVERLAP");
        }
        const hasSameHalf = existingODs.some((od) => od.sessionType === sessionType);
        if (hasSameHalf) {
          throw new Error("OD_REQUEST_OVERLAP");
        }
      }

      // 3. Generate sequential human-readable code
      const odId = await OnDutyService.generateODId(tx, targetDate);

      // 4. Create the OnDutyRequest record
      const request = await tx.onDutyRequest.create({
        data: {
          odId,
          employeeId: data.employeeId,
          date: targetDate,
          sessionType,
          reason: data.reason.trim(),
          location: data.location?.trim() || null,
          status: "PENDING",
        },
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
        },
      });

      // 5. Activity & Audit logging
      await tx.activityLog.create({
        data: {
          employeeId: data.employeeId,
          action: "OD_REQUEST_SUBMITTED",
          module: "ON_DUTY",
          description: `On Duty request (${odId}) submitted for ${getKolkataDateString(targetDate)} (${sessionType}).`,
          metadata: {
            odRequestId: request.id,
            odId,
            sessionType,
            date: getKolkataDateString(targetDate),
            location: data.location || null,
          },
        },
      });

      await AuditService.logEvent(
        {
          employeeId: data.employeeId,
          performedById: data.actorId || data.employeeId,
          action: "OD_REQUEST_CREATED",
          module: "ON_DUTY",
          description: `Created OD request ${odId} for employee ${employee.fullName}`,
          metadata: {
            odRequestId: request.id,
            odId,
            sessionType,
            date: getKolkataDateString(targetDate),
            targetEmployeeId: data.employeeId,
          },
        },
        tx
      );

      return request;
    });
  }

  /**
   * Approves an On Duty request and automatically regularizes attendance for the target date.
   */
  static async approveODRequest(odRequestId: string, reviewerEmployeeId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch OD request
      const od = await tx.onDutyRequest.findUnique({
        where: { id: odRequestId },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              employeeCode: true,
              shiftStart: true,
              shiftEnd: true,
            },
          },
        },
      });

      if (!od) {
        throw new Error("OD_REQUEST_NOT_FOUND");
      }

      if (od.status === "APPROVED") {
        throw new Error("OD_ALREADY_APPROVED");
      }

      if (od.status === "REJECTED" || od.status === "CANCELLED") {
        throw new Error("INVALID_OD_STATE");
      }

      // 2. Mark OD request as APPROVED
      const approvedOD = await tx.onDutyRequest.update({
        where: { id: odRequestId },
        data: {
          status: "APPROVED",
          approvedById: reviewerEmployeeId,
          approvedAt: new Date(),
        },
      });

      // 3. Auto-Regularize Attendance for that Date
      const startOfDay = getStartOfDay(od.date);
      const endOfDay = getEndOfDay(od.date);
      const targetAttendanceStatus = od.sessionType === "FULL_DAY" ? "PRESENT" : "HALF_DAY";

      const shiftStartStr = od.employee.shiftStart || "09:30";
      const shiftEndStr = od.employee.shiftEnd || "18:30";
      const [startH = 9, startM = 30] = shiftStartStr.split(":").map(Number);
      const [endH = 18, endM = 30] = shiftEndStr.split(":").map(Number);

      const scheduledCheckIn = new Date(startOfDay.getTime() + (startH * 60 + startM) * 60 * 1000);
      const scheduledCheckOut = new Date(startOfDay.getTime() + (endH * 60 + endM) * 60 * 1000);

      const standardDaySeconds = calculateDurationSeconds(scheduledCheckIn, scheduledCheckOut) || 28800;
      const regularizedWorkingSeconds =
        od.sessionType === "FULL_DAY"
          ? standardDaySeconds
          : Math.floor(standardDaySeconds / 2);

      let attendance = await tx.attendance.findFirst({
        where: {
          employeeId: od.employeeId,
          date: { gte: startOfDay, lte: endOfDay },
        },
        include: { sessions: true },
      });

      if (!attendance) {
        attendance = await tx.attendance.create({
          data: {
            employeeId: od.employeeId,
            date: startOfDay,
            checkIn: scheduledCheckIn,
            checkOut: scheduledCheckOut,
            status: targetAttendanceStatus,
            isLate: false,
            lateMinutes: 0,
            earlyLogoutMinutes: 0,
            totalWorkingSeconds: regularizedWorkingSeconds,
            totalBreakSeconds: 0,
            netWorkingSeconds: regularizedWorkingSeconds,
          },
          include: { sessions: true },
        });
      } else {
        attendance = await tx.attendance.update({
          where: { id: attendance.id },
          data: {
            checkIn: attendance.checkIn || scheduledCheckIn,
            checkOut: attendance.checkOut || scheduledCheckOut,
            status: targetAttendanceStatus,
            isLate: false,
            lateMinutes: 0,
            totalWorkingSeconds: Math.max(attendance.totalWorkingSeconds, regularizedWorkingSeconds),
            netWorkingSeconds: Math.max(attendance.netWorkingSeconds, regularizedWorkingSeconds),
          },
          include: { sessions: true },
        });
      }

      // Record an AttendanceSession annotated for On Duty
      await tx.attendanceSession.create({
        data: {
          attendanceId: attendance.id,
          employeeId: od.employeeId,
          punchIn: scheduledCheckIn,
          punchOut: scheduledCheckOut,
          workingSeconds: regularizedWorkingSeconds,
        },
      });

      // 4. Activity & Audit logging
      await tx.activityLog.create({
        data: {
          employeeId: od.employeeId,
          action: "OD_APPROVED",
          module: "ON_DUTY",
          description: `On Duty request (${od.odId}) approved. Attendance regularized to ${targetAttendanceStatus}.`,
          metadata: {
            odRequestId: od.id,
            odId: od.odId,
            sessionType: od.sessionType,
            date: getKolkataDateString(od.date),
            attendanceId: attendance.id,
            reviewerId: reviewerEmployeeId,
          },
        },
      });

      await AuditService.logEvent(
        {
          employeeId: od.employeeId,
          performedById: reviewerEmployeeId,
          action: "OD_APPROVED",
          module: "ON_DUTY",
          description: `Approved OD request ${od.odId} for employee ${od.employee.fullName}`,
          metadata: {
            odRequestId: od.id,
            odId: od.odId,
            targetEmployeeId: od.employeeId,
            attendanceId: attendance.id,
          },
        },
        tx
      );

      return {
        request: approvedOD,
        attendance,
      };
    });
  }

  /**
   * Rejects an On Duty request.
   */
  static async rejectODRequest(odRequestId: string, reviewerEmployeeId: string, rejectionReason: string) {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new Error("REJECTION_REASON_REQUIRED");
    }

    return prisma.$transaction(async (tx) => {
      const od = await tx.onDutyRequest.findUnique({
        where: { id: odRequestId },
        include: { employee: true },
      });

      if (!od) {
        throw new Error("OD_REQUEST_NOT_FOUND");
      }

      if (od.status !== "PENDING") {
        throw new Error("INVALID_OD_STATE");
      }

      const rejectedOD = await tx.onDutyRequest.update({
        where: { id: odRequestId },
        data: {
          status: "REJECTED",
          approvedById: reviewerEmployeeId,
          approvedAt: new Date(),
          rejectionReason: rejectionReason.trim(),
        },
      });

      await tx.activityLog.create({
        data: {
          employeeId: od.employeeId,
          action: "OD_REJECTED",
          module: "ON_DUTY",
          description: `On Duty request (${od.odId}) was rejected. Reason: ${rejectionReason.trim()}`,
          metadata: {
            odRequestId: od.id,
            odId: od.odId,
            rejectionReason: rejectionReason.trim(),
            reviewerId: reviewerEmployeeId,
          },
        },
      });

      await AuditService.logEvent(
        {
          employeeId: od.employeeId,
          performedById: reviewerEmployeeId,
          action: "OD_REJECTED",
          module: "ON_DUTY",
          description: `Rejected OD request ${od.odId} for employee ${od.employee.fullName}`,
          metadata: {
            odRequestId: od.id,
            odId: od.odId,
            targetEmployeeId: od.employeeId,
            rejectionReason: rejectionReason.trim(),
          },
        },
        tx
      );

      return rejectedOD;
    });
  }

  /**
   * Cancels a pending On Duty request (by employee or admin).
   */
  static async cancelODRequest(odRequestId: string, actorId: string, actorRole: string) {
    return prisma.$transaction(async (tx) => {
      const od = await tx.onDutyRequest.findUnique({
        where: { id: odRequestId },
        include: { employee: true },
      });

      if (!od) {
        throw new Error("OD_REQUEST_NOT_FOUND");
      }

      if (od.status !== "PENDING") {
        throw new Error("CANNOT_CANCEL_NON_PENDING");
      }

      // Non-privileged users can only cancel their own request
      if (actorRole !== "ADMIN" && actorRole !== "HR_MANAGER" && od.employeeId !== actorId) {
        throw new Error("FORBIDDEN");
      }

      const cancelledOD = await tx.onDutyRequest.update({
        where: { id: odRequestId },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.activityLog.create({
        data: {
          employeeId: od.employeeId,
          action: "OD_CANCELLED",
          module: "ON_DUTY",
          description: `On Duty request (${od.odId}) was cancelled.`,
          metadata: { odRequestId: od.id, odId: od.odId, cancelledBy: actorId },
        },
      });

      await AuditService.logEvent(
        {
          employeeId: od.employeeId,
          performedById: actorId,
          action: "OD_CANCELLED",
          module: "ON_DUTY",
          description: `Cancelled OD request ${od.odId} for employee ${od.employee.fullName}`,
          metadata: { odRequestId: od.id, odId: od.odId, cancelledBy: actorId },
        },
        tx
      );

      return cancelledOD;
    });
  }

  /**
   * Retrieves single On Duty request by ID with permission checks.
   */
  static async getODRequestById(id: string, actorEmployeeId: string, actorRole: string) {
    const od = await prisma.onDutyRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,
            email: true,
            avatar: true,
            department: { select: { id: true, name: true, code: true } },
          },
        },
        reviewer: {
          select: {
            id: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,
          },
        },
      },
    });

    if (!od) {
      throw new Error("OD_REQUEST_NOT_FOUND");
    }

    // Role check: non-privileged users can only view their own request
    if (actorRole !== "ADMIN" && actorRole !== "HR_MANAGER" && actorRole !== "MANAGER" && actorRole !== "COMPLIANCE_AUDITOR") {
      if (od.employeeId !== actorEmployeeId) {
        throw new Error("FORBIDDEN");
      }
    }

    return {
      ...od,
      dateString: getKolkataDateString(od.date),
    };
  }

  /**
   * Retrieves paginated On Duty history for a specific employee.
   */
  static async getEmployeeODHistory(employeeId: string, options: ODFilterOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OnDutyRequestWhereInput = { employeeId };

    if (options.status && options.status !== "ALL") {
      where.status = options.status as ODStatus;
    }

    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = getStartOfDay(options.startDate);
      }
      if (options.endDate) {
        where.date.lte = getEndOfDay(options.endDate);
      }
    }

    const [total, requests] = await Promise.all([
      prisma.onDutyRequest.count({ where }),
      prisma.onDutyRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          reviewer: {
            select: { id: true, fullName: true, employeeId: true },
          },
        },
      }),
    ]);

    return {
      requests: requests.map((r) => ({
        ...r,
        dateString: getKolkataDateString(r.date),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Retrieves paginated On Duty overview for administrative review.
   */
  static async getAdminODOverview(options: ODFilterOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OnDutyRequestWhereInput = {};

    if (options.status && options.status !== "ALL") {
      where.status = options.status as ODStatus;
    }

    if (options.departmentId) {
      where.employee = { departmentId: options.departmentId };
    }

    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = getStartOfDay(options.startDate);
      }
      if (options.endDate) {
        where.date.lte = getEndOfDay(options.endDate);
      }
    }

    if (options.search?.trim()) {
      const search = options.search.trim();
      where.OR = [
        { odId: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
        { employee: { fullName: { contains: search, mode: "insensitive" } } },
        { employee: { employeeCode: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, requests] = await Promise.all([
      prisma.onDutyRequest.count({ where }),
      prisma.onDutyRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ status: "asc" }, { date: "desc" }],
        include: {
          employee: {
            select: {
              id: true,
              employeeCode: true,
              fullName: true,
              email: true,
              avatar: true,
              department: { select: { id: true, name: true, code: true } },
            },
          },
          reviewer: {
            select: { id: true, fullName: true, employeeCode: true },
          },
        },
      }),
    ]);

    return {
      requests: requests.map((r) => ({
        ...r,
        dateString: getKolkataDateString(r.date),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
