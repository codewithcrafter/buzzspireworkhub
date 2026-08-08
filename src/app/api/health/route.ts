import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import os from "os";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/lib/api-response";

export async function GET() {
  try {
    // Check DB connection
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStartTime;

    const memoryUsage = process.memoryUsage();
    
    const healthStatus = {
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        loadavg: os.loadavg(),
      },
      process: {
        memoryUsage: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
        },
      },
      database: {
        status: "CONNECTED",
        latencyMs: dbLatency,
      }
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    logger.error("Health check failed", error);
    
    return NextResponse.json({
      status: "DOWN",
      timestamp: new Date().toISOString(),
      error: "Service degraded"
    }, { status: 503 });
  }
}
