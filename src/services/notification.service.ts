import { prisma } from "@/lib/prisma";

export interface CreateNotificationParams {
  employeeId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}

export interface GetNotificationsParams {
  employeeId: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export class NotificationService {
  /**
   * Creates a new notification record in database.
   */
  static async createNotification(params: CreateNotificationParams) {
    const { employeeId, type, title, message, metadata } = params;
    return await prisma.notification.create({
      data: {
        employeeId,
        type,
        title,
        message,
        metadata: metadata || undefined,
      },
    });
  }

  /**
   * Fetches paginated notifications for an employee.
   */
  static async getNotifications(params: GetNotificationsParams) {
    const { employeeId, page = 1, limit = 20, unreadOnly = false } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const where: any = { employeeId };
    if (unreadOnly) {
      where.readAt = null;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { employeeId, readAt: null } }),
    ]);

    return {
      rows: notifications,
      unreadCount,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Marks a single notification as read if owned by the employee.
   */
  static async markAsRead(id: string, employeeId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, employeeId },
    });

    if (!notification) return null;

    if (notification.readAt) return notification;

    return await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  /**
   * Marks all unread notifications for an employee as read.
   */
  static async markAllAsRead(employeeId: string) {
    return await prisma.notification.updateMany({
      where: { employeeId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  /**
   * Retrieves current unread notification count for an employee.
   */
  static async getUnreadCount(employeeId: string) {
    return await prisma.notification.count({
      where: { employeeId, readAt: null },
    });
  }

  /**
   * Deletes a single notification — only if it belongs to the given employee.
   * Returns the deleted record, or null if not found / not owned.
   */
  static async deleteNotification(id: string, employeeId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, employeeId },
    });

    if (!notification) return null;

    return await prisma.notification.delete({ where: { id } });
  }
}
