import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJwt(token);

        if (!payload || payload.role !== "CLIENT") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const clientId = payload.id as string;

        const user = await prisma.user.findUnique({
            where: { id: clientId },
            select: {
                name: true,
                company: true,
                email: true,
                phone: true,
                contractAmount: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const clientPayments = await prisma.clientPayment.findMany({
            where: { clientId },
            orderBy: { date: "desc" },
        });

        const invoicePayments = await prisma.payment.findMany({
            where: { invoice: { clientId }, status: "SUCCESS" },
            include: { invoice: { select: { service: true } } },
            orderBy: { createdAt: "desc" }
        });

        // Unified Ledger: Merge and deduplicate to fix historical double-counting
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
            where: { clientId },
            orderBy: { date: "desc" },
        });

        const updates = await prisma.clientUpdate.findMany({
            where: { clientId },
            orderBy: { createdAt: "desc" },
        });

        const projects = await prisma.project.findMany({
            where: { clientId },
            include: {
                milestones: {
                    orderBy: { order: "asc" }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const totalPaid = mergedPayments.reduce((sum, p) => sum + p.amount, 0);
        const remainingBalance = (user.contractAmount || 0) - totalPaid;
        const remainingContract = (user.contractAmount || 0) - totalPaid;

        return NextResponse.json({
            client: user,
            financials: {
                totalBudget: user.contractAmount,
                totalPaid,
                remainingBalance,
                remainingContract
            },
            payments: mergedPayments,
            usages,
            updates,
            projects
        }, { status: 200 });

    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
