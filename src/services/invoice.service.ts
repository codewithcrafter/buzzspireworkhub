import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

export async function createInvoice(
    clientId: string,
    amount: number,
    projectId?: string,
    dueDate?: Date
) {
    return prisma.invoice.create({
        data: {
            clientId,
            projectId,
            amount,
            dueDate,
            status: "DRAFT",
        },
    });
}

export async function updateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatus
) {
    return prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
    });
}

export async function getAdminInvoices() {
    return prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            client: { select: { name: true, email: true } },
            project: { select: { title: true } },
        },
    });
}

export async function getClientInvoices(clientId: string) {
    return prisma.invoice.findMany({
        where: { clientId },
        orderBy: { createdAt: "desc" },
        include: {
            project: { select: { title: true } },
            payments: true,
        },
    });
}
