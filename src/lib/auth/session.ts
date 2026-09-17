import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface CreateSessionParams {
  employeeId: string;
  ipAddress?: string;
  userAgent?: string;
  durationDays?: number;
}

/**
 * Creates a new active LoginSession record in the database.
 */
export async function createSession(params: CreateSessionParams) {
  const { employeeId, ipAddress, userAgent, durationDays = 1 } = params;
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  const session = await prisma.loginSession.create({
    data: {
      employeeId,
      sessionToken,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
      lastActivity: new Date(),
    },
  });

  return session;
}

/**
 * Updates lastActivity timestamp for an active session.
 */
export async function touchSession(sessionId: string) {
  try {
    return await prisma.loginSession.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() },
    });
  } catch {
    return null;
  }
}

/**
 * Revokes an existing LoginSession by setting revokedAt.
 */
export async function revokeSession(sessionId: string) {
  try {
    return await prisma.loginSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  } catch {
    return null;
  }
}

/**
 * Validates whether a LoginSession is active, not revoked, and not expired.
 */
export async function validateSession(sessionId: string) {
  if (!sessionId) return null;

  const session = await prisma.loginSession.findUnique({
    where: { id: sessionId },
    include: {
      employee: {
        include: {
          role: true,
          department: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.revokedAt) return null;
  if (session.expiresAt < new Date()) return null;
  if (session.employee.status !== "ACTIVE") return null;

  return session;
}
