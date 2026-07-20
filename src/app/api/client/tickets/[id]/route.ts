import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { getTicketDetails, addTicketReply } from "@/services/ticket.service";
import { prisma } from "@/lib/prisma";

// GET: Securely retrieve ticket details and reply thread for the authenticated client
export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
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

        const ticketId = params.id;
        const clientId = payload.id as string;

        const ticket = await getTicketDetails(ticketId, clientId, "CLIENT");

        return NextResponse.json(
            {
                ticket,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Client Ticket Details GET Error:", error);
        
        if (error instanceof Error && error.message.includes("Access denied")) {
            return NextResponse.json(
                { error: "Forbidden: Access to this ticket is denied" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: Add a reply to the ticket thread (reopens if resolved/closed)
export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
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

        const ticketId = params.id;
        const clientId = payload.id as string;
        const { text } = await req.json();

        if (!text || text.trim() === "") {
            return NextResponse.json(
                { error: "Reply text is required" },
                { status: 400 }
            );
        }

        // Validate ticket ownership before saving reply
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket not found" },
                { status: 404 }
            );
        }

        if (ticket.clientId !== clientId) {
            return NextResponse.json(
                { error: "Forbidden: You do not own this ticket" },
                { status: 403 }
            );
        }

        const reply = await addTicketReply(ticketId, clientId, text.trim());

        return NextResponse.json(
            {
                message: "Reply added successfully",
                reply,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Client Ticket Reply POST Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
