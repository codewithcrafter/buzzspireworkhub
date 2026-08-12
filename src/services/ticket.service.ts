import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

export async function createTicket(
    clientId: string,
    subject: string,
    description: string
) {
    return prisma.ticket.create({
        data: {
            clientId,
            subject,
            description,
            status: "OPEN",
        },
    });
}

export async function addTicketReply(
    ticketId: string,
    senderId: string,
    text: string
) {
    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    // Determine if sender is Admin or Client, and potentially auto-update status
    // If the ticket was RESOLVED/CLOSED and someone replies, we reopen it as OPEN
    let nextStatus: TicketStatus = ticket.status;
    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
        nextStatus = "OPEN";
    }

    // Save reply and update ticket timestamp/status in a transaction
    const [reply] = await prisma.$transaction([
        prisma.ticketReply.create({
            data: {
                ticketId,
                senderId,
                text,
            },
        }),
        prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: nextStatus,
                updatedAt: new Date(),
            },
        }),
    ]);

    return reply;
}

export async function getClientTickets(clientId: string) {
    return prisma.ticket.findMany({
        where: { clientId },
        include: {
            replies: {
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { updatedAt: "desc" },
    });
}

export async function getTicketDetails(ticketId: string, userId: string, role: string) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
            replies: {
                orderBy: { createdAt: "asc" },
            },
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    company: true,
                },
            },
        },
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    // Enforce data isolation: clients can only view their own tickets
    if (role === "CLIENT" && ticket.clientId !== userId) {
        throw new Error("Access denied");
    }

    return ticket;
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
    return prisma.ticket.update({
        where: { id: ticketId },
        data: {
            status,
            updatedAt: new Date(),
        },
    });
}

export async function getAllTickets() {
    return prisma.ticket.findMany({
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    company: true,
                },
            },
        },
        orderBy: { updatedAt: "desc" },
    });
}
