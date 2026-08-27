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

    const clientPayments = await prisma.clientPayment.findMany({
      where: { clientId: id },
      orderBy: { date: "desc" },
    });

    const invoicePayments = await prisma.payment.findMany({
      where: { invoice: { clientId: id }, status: "SUCCESS" },
      include: { invoice: { select: { service: true } } },
      orderBy: { createdAt: "desc" }
    });

    // Unified Ledger: Merge and deduplicate
    const mergedPayments: any[] = [];

    for (const p of invoicePayments) {
        mergedPayments.push({
            id: p.id,
            amount: p.amount,
            date: p.createdAt,
            description: p.invoice?.service || "Invoice Payment",
            method: p.method,
            transactionId: p.transactionId,
            status: "PAID"
        });
    }

    for (const cp of clientPayments) {
        // Deduplicate by amount AND time: if an invoice payment exists with the exact same amount
        // within 14 days, we assume the ClientPayment is a redundant manual entry for the same logical payment.
        const cpTime = new Date(cp.date).getTime();
        const isDuplicate = mergedPayments.some(mp => {
            const mpTime = new Date(mp.date).getTime();
            const timeDiff = Math.abs(mpTime - cpTime);
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            return mp.amount === cp.amount && daysDiff <= 14;
        });
        
        if (!isDuplicate) {
            mergedPayments.push({
                id: cp.id,
                amount: cp.amount,
                date: cp.date,
                description: cp.description,
                method: cp.method,
                transactionId: null,
                status: cp.status
            });
        }
    }

    mergedPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const usages = await prisma.clientUsage.findMany({
      where: { clientId: id },
      orderBy: { date: "desc" },
    });

    const totalPaid = mergedPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalUsed = usages.reduce((sum, u) => sum + u.amount, 0);
    const remainingBalance = (clientUser.contractAmount || 0) - totalPaid;

    return NextResponse.json({
      contractAmount: clientUser.contractAmount,
      totalPaid,
      totalUsed,
      remainingBalance,
      payments: mergedPayments,
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
