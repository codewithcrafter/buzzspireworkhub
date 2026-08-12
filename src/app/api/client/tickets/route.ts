import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { getClientTickets, createTicket } from "@/services/ticket.service";

// GET: List all tickets for the authenticated client
export async function GET() {
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

        if (!payload || payload.role !== "CLIENT") {
            return NextResponse.json(
                { error: "Forbidden: Client access only" },
                { status: 403 }
            );
        }

        const clientId = payload.id as string;
        const tickets = await getClientTickets(clientId);

        return NextResponse.json(
            {
                tickets,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Client Tickets GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: Create a new support ticket
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

        if (!payload || payload.role !== "CLIENT") {
            return NextResponse.json(
                { error: "Forbidden: Client access only" },
                { status: 403 }
            );
        }

        const { subject, description } = await req.json();

        if (!subject || !description) {
            return NextResponse.json(
                { error: "Subject and description are required" },
                { status: 400 }
            );
        }

        const clientId = payload.id as string;
        const ticket = await createTicket(clientId, subject, description);

        return NextResponse.json(
            {
                message: "Ticket created successfully",
                ticket,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Client Ticket POST Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
