import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import os from "os";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/lib/api-response";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  }, { status: 200 });
}
