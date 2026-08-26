import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Verify the user exists and is a CLIENT
    const clientUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!clientUser || clientUser.role !== "CLIENT") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Perform database deletion
    // Must delete child records first due to RESTRICT foreign key constraints in schema
    await prisma.$transaction([
      prisma.aiUsageHistory.deleteMany({ where: { userId: id } }),
      prisma.payment.deleteMany({ where: { invoice: { clientId: id } } }),
      prisma.invoice.deleteMany({ where: { clientId: id } }),
      prisma.ticket.deleteMany({ where: { clientId: id } }),
      prisma.project.deleteMany({ where: { clientId: id } }),
      prisma.user.delete({ where: { id } })
    ]);

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
