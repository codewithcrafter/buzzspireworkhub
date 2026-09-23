import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { SettingsService } from "@/services/settings.service";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (auth.role === "ADMIN") {
      return NextResponse.json({ success: true, data: { idle: false } });
    }

    // 1. Get Settings
    const idleEnabledStr = await SettingsService.get("idle_monitoring_enabled");
    const enabled = idleEnabledStr !== "false";
    const idleThresholdStr = await SettingsService.get("idle_detection_threshold_minutes");
    const thresholdMinutes = parseInt(idleThresholdStr || "2", 10);
    const thresholdMs = thresholdMinutes * 60 * 1000;

    if (!enabled) {
      return NextResponse.json({ success: true, data: { idle: false, enabled, thresholdMinutes } });
    }

    // 2. Windows Agent Enrolled/Authenticated Check
    const activeDevice = await prisma.agentDevice.findFirst({
      where: {
        employeeId: auth.employee.id,
        status: "ACTIVE",
      }
    });

    if (!activeDevice) {
      // If no agent is enrolled, we cannot track global OS idle state, so return false
      return NextResponse.json({ success: true, data: { idle: false, enabled, thresholdMinutes } });
    }

    // 4. Determine OS-level Inactivity
    const latestHeartbeat = await prisma.activityLog.findFirst({
      where: {
        employeeId: auth.employee.id,
        action: "LATEST_HEARTBEAT",
        module: "AGENT"
      }
    });

    if (!latestHeartbeat) {
      // If agent is enrolled but no heartbeats yet, assume active
      return NextResponse.json({ success: true, data: { idle: false, enabled, thresholdMinutes } });
    }

    let metadataObj = latestHeartbeat.metadata as any;
    if (typeof metadataObj === 'string') {
      try { metadataObj = JSON.parse(metadataObj); } catch(e) {}
    }
    const osIdleSeconds = Number(metadataObj?.osIdleSeconds) || 0;

    // Mathematically correct idle calculation:
    // The device reported `osIdleSeconds` exactly at `latestHeartbeat.createdAt`.
    // Assuming no new heartbeat has arrived, the current idle time is:
    const secondsSinceHeartbeat = (Date.now() - latestHeartbeat.createdAt.getTime()) / 1000;
    const currentEstimatedIdleSeconds = osIdleSeconds + secondsSinceHeartbeat;

    let isIdle = false;
    let idleDetectedAt: string | null = null;

    if (currentEstimatedIdleSeconds >= (thresholdMinutes * 60)) {
      isIdle = true;
      // When did they actually go idle?
      idleDetectedAt = new Date(Date.now() - (currentEstimatedIdleSeconds * 1000)).toISOString();
    }

    return NextResponse.json({
      success: true,
      data: {
        idle: isIdle,
        enabled,
        thresholdMinutes,
        idleSeconds: Math.floor(currentEstimatedIdleSeconds),
        idleDetectedAt
      }
    });
  } catch (error: any) {
    return ApiResponse.serverError("Error checking idle status", error);
  }
}
