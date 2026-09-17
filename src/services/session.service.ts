import { createSession, revokeSession, validateSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export class SessionService {
  /**
   * Creates a new session for an employee.
   */
  static async create(employeeId: string, ipAddress?: string, userAgent?: string) {
    return createSession({ employeeId, ipAddress, userAgent });
  }

  /**
   * Revokes an active session.
   */
  static async revoke(sessionId: string) {
    return revokeSession(sessionId);
  }

  /**
   * Validates a session by ID.
   */
  static async validate(sessionId: string) {
    return validateSession(sessionId);
  }

  /**
   * Revokes all active sessions for an employee.
   */
  static async revokeAllForEmployee(employeeId: string) {
    return prisma.loginSession.updateMany({
      where: {
        employeeId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
