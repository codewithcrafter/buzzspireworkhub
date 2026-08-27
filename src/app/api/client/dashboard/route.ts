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

        const payments = await prisma.clientPayment.findMany({
            where: { clientId },
            orderBy: { date: "desc" },
        });

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

        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
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
            payments,
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
