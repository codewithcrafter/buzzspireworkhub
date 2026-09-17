import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export class AgentService {
  /**
   * Generates a short-lived token for initial agent enrollment.
   */
  static async generateEnrollmentToken(employeeId: string, expiresInHours: number = 24) {
    const tokenStr = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    return await prisma.agentEnrollmentToken.create({
      data: {
        token: tokenStr,
        employeeId,
        expiresAt,
      },
    });
  }

  /**
   * Exchanges an enrollment token for a persistent device credential.
   */
  static async enrollDevice(tokenStr: string, deviceId: string, deviceName: string) {
    const token = await prisma.agentEnrollmentToken.findUnique({
      where: { token: tokenStr },
    });

    if (!token || token.isUsed || token.expiresAt < new Date()) {
      throw new Error("Invalid or expired enrollment token");
    }

    // Mark used
    await prisma.agentEnrollmentToken.update({
      where: { id: token.id },
      data: { isUsed: true },
    });

    // Check if device already exists, or create new
    const credential = crypto.randomBytes(32).toString("hex");

    const existingDevice = await prisma.agentDevice.findUnique({
      where: { deviceId },
    });

    if (existingDevice) {
      return await prisma.agentDevice.update({
        where: { deviceId },
        data: {
          employeeId: token.employeeId,
          credential,
          deviceName,
          status: "ACTIVE",
          enrolledAt: new Date(),
          revokedAt: null,
        },
      });
    }

    return await prisma.agentDevice.create({
      data: {
        deviceId,
        employeeId: token.employeeId,
        credential,
        deviceName,
      },
    });
  }

  /**
   * Authenticate a device credential.
   */
  static async authenticateDevice(credential: string) {
    const device = await prisma.agentDevice.findUnique({
      where: { credential },
      include: { employee: true },
    });

    if (!device || device.status !== "ACTIVE") {
      return null;
    }

    // Lifecycle enforcement
    if (
      device.employee.status === "EXITED" || 
      device.employee.status === "TERMINATED" || 
      device.employee.status === "SUSPENDED" || 
      device.employee.status === "INACTIVE"
    ) {
      return null;
    }

    return device;
  }

  /**
   * Record a heartbeat from the agent.
   */
  static async recordHeartbeat(deviceId: string, agentVersion: string) {
    return await prisma.agentDevice.update({
      where: { deviceId },
      data: {
        lastSeenAt: new Date(),
        agentVersion,
      },
    });
  }

  /**
   * Revoke a device.
   */
  static async revokeDevice(deviceId: string) {
    return await prisma.agentDevice.update({
      where: { deviceId },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Fetch all devices (for Admin UI).
   */
  static async getAllDevices() {
    return await prisma.agentDevice.findMany({
      include: {
        employee: {
          select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } },
        },
      },
      orderBy: { lastSeenAt: "desc" },
    });
  }

  /**
   * Ingest a batch of events from the agent.
   */
  static async ingestEvents(employeeId: string, deviceId: string, events: any[]) {
    if (!events || events.length === 0) return { count: 0 };

    const logsToCreate = events.map((event) => {
      let action = "AGENT_EVENT";
      let description = event.applicationName || event.state || "Unknown Agent Event";

      if (event.eventType === "APPLICATION_ACTIVITY") {
        action = "APPLICATION_ACTIVITY";
      } else if (event.eventType === "IDLE_STATE") {
        action = "IDLE_STATE";
      } else if (event.eventType === "WEBSITE_ACTIVITY") {
        action = "WEBSITE_ACTIVITY";
        description = event.domain || "Website";
      }

      return {
        employeeId,
        action,
        module: "AGENT",
        description,
        metadata: {
          deviceId,
          ...event,
        },
        // We allow the client to set the createdAt if it was queued offline
        createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
      };
    });

    // Use createMany to efficiently insert the batch
    const result = await prisma.activityLog.createMany({
      data: logsToCreate,
      skipDuplicates: true, // Though they don't have natural unique keys unless we pass ID
    });

    return { count: result.count };
  }
}
