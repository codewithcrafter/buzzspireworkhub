import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "BuzzSpire Media API is running",
    timestamp: new Date().toISOString(),
  });
}
