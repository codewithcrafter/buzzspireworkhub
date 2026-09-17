import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Default break types used as fallback if database table is empty or offline
const DEFAULT_BREAK_TYPES = [
  { id: "bt-tea", name: "Tea / Coffee Break", description: "Short 15-minute tea or coffee break", status: "ACTIVE" },
  { id: "bt-lunch", name: "Lunch Break", description: "Standard 45-60 minute lunch break", status: "ACTIVE" },
  { id: "bt-personal", name: "Personal Break", description: "Personal emergency or rest break", status: "ACTIVE" },
];

// GET /api/breaks/types
export async function GET() {
  try {
    const breakTypes = await prisma.breakType.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    });

    const result = breakTypes.length > 0 ? breakTypes : DEFAULT_BREAK_TYPES;

    return NextResponse.json({
      success: true,
      data: { breakTypes: result },
      breakTypes: result,
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: { breakTypes: DEFAULT_BREAK_TYPES },
      breakTypes: DEFAULT_BREAK_TYPES,
    });
  }
}
