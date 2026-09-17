import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Attempt a lightweight database query to check connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      database: "ok",
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    // Do not log the actual DB error or expose stack traces in the response
    return NextResponse.json({
      status: "ok", // App is running
      database: "unavailable",
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
