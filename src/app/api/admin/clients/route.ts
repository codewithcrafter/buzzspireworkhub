import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { createClient } from "@/services/user.service";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyJwt(token);

        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const user = await createClient(name, email, password);

        return NextResponse.json(
            {
                message: "Client created successfully",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyJwt(token);

        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { prisma } = await import("@/lib/prisma");

        const clients = await prisma.user.findMany({
            where: { role: "CLIENT" },
            select: {
                id: true,
                name: true,
                company: true,
                email: true,
                phone: true,
                status: true,
                createdAt: true,
                projects: { select: { id: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        const mappedClients = clients.map(c => ({
            id: c.id,
            name: c.name,
            company: c.company || "N/A",
            email: c.email,
            phone: c.phone || "N/A",
            status: c.status === "ACTIVE" ? "active" : c.status === "INACTIVE" ? "inactive" : "pending",
            revenue: 0, // This could be calculated from invoices if needed
            joined: c.createdAt.toISOString().split("T")[0],
            projectsCount: c.projects.length
        }));

        return NextResponse.json({ clients: mappedClients }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyJwt(token);

        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "An array of client IDs is required" },
                { status: 400 }
            );
        }

        const { prisma } = await import("@/lib/prisma");

        // Verify the users exist and are CLIENTs
        const clientUsers = await prisma.user.findMany({
            where: { id: { in: ids }, role: "CLIENT" },
        });

        if (clientUsers.length !== ids.length) {
            return NextResponse.json(
                { error: "One or more clients not found or invalid role" },
                { status: 404 }
            );
        }

        // Perform database bulk deletion
        // Must delete child records first due to RESTRICT foreign key constraints in schema
        await prisma.$transaction([
            prisma.aiUsageHistory.deleteMany({ where: { userId: { in: ids } } }),
            prisma.payment.deleteMany({ where: { invoice: { clientId: { in: ids } } } }),
            prisma.invoice.deleteMany({ where: { clientId: { in: ids } } }),
            prisma.ticket.deleteMany({ where: { clientId: { in: ids } } }),
            prisma.project.deleteMany({ where: { clientId: { in: ids } } }),
            prisma.user.deleteMany({ where: { id: { in: ids }, role: "CLIENT" } })
        ]);

        return NextResponse.json(
            { message: "Clients deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Bulk delete client error:", error);
        return NextResponse.json(
            { error: "Internal Server Error. The clients could not be deleted." },
            { status: 500 }
        );
    }
}
