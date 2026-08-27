import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const client = await prisma.user.findFirst({
        where: { company: "Anantyakrit Solutions" }
    });
    if (!client) return NextResponse.json({ error: "not found" });
    
    const cp = await prisma.clientPayment.findMany({ where: { clientId: client.id } });
    const p = await prisma.payment.findMany({ where: { invoice: { clientId: client.id } }, include: { invoice: true } });
    const inv = await prisma.invoice.findMany({ where: { clientId: client.id } });
    return NextResponse.json({ client, clientPayments: cp, payments: p, invoices: inv });
}
