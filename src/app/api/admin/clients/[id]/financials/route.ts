import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJwt(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const clientUser = await prisma.user.findUnique({
      where: { id },
      select: { contractAmount: true },
    });

    if (!clientUser) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const payments = await prisma.clientPayment.findMany({
      where: { clientId: id },
      orderBy: { date: "desc" },
    });

    const usages = await prisma.clientUsage.findMany({
      where: { clientId: id },
      orderBy: { date: "desc" },
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalUsed = usages.reduce((sum, u) => sum + u.amount, 0);
    const remainingBalance = totalPaid - totalUsed;

    return NextResponse.json({
      contractAmount: clientUser.contractAmount,
      totalPaid,
      totalUsed,
      remainingBalance,
      payments,
      usages,
    });
  } catch (error) {
    console.error("Financials GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJwt(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    if (body.type === "payment") {
      const payment = await prisma.clientPayment.create({
        data: {
          clientId: id,
          amount: parseFloat(body.amount),
          description: body.description,
          method: body.method || null,
          date: body.date ? new Date(body.date) : new Date(),
        },
      });
      return NextResponse.json({ payment }, { status: 201 });
    } else if (body.type === "usage") {
      const usage = await prisma.clientUsage.create({
        data: {
          clientId: id,
          amount: parseFloat(body.amount),
          description: body.description,
          category: body.category || "General",
          note: body.note || null,
          date: body.date ? new Date(body.date) : new Date(),
        },
      });
      return NextResponse.json({ usage }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Invalid record type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Financials POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyJwt(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    if (typeof body.contractAmount !== "number") {
      return NextResponse.json({ error: "Invalid contract amount" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { contractAmount: body.contractAmount },
    });

    return NextResponse.json({ contractAmount: updated.contractAmount });
  } catch (error) {
    console.error("Financials PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
