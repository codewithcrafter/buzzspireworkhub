import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pageRecord = await prisma.page.findUnique({
      where: { slug: "career" }
    });
    return NextResponse.json({ success: true, data: pageRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, fullError: error }, { status: 500 });
  }
}
