import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

export async function createInvoice(data: {
    clientId: string;
    amount: number;
    projectId?: string;
    dueDate?: Date;
    invoiceNumber?: string;
    service?: string;
    description?: string;
    subtotal?: number;
    tax?: number;
    discount?: number;
    notes?: string;
    paymentMethod?: string;
    transactionId?: string;
    paymentDate?: Date;
    status?: InvoiceStatus;
}) {
    // Generate invoice number if not provided
    const invNumber = data.invoiceNumber || `BSM-INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const { paymentMethod, transactionId, paymentDate, ...invoiceData } = data;

    const invoiceStatus = data.status || "DRAFT";

    // Build the create payload
    const createPayload: any = {
        ...invoiceData,
        invoiceNumber: invNumber,
        status: invoiceStatus,
    };

    // If the status is PAID, we map the UI payment details to the EXISTING Payment model
    if (invoiceStatus === "PAID") {
        let mappedMethod = "OTHER";
        const pm = (paymentMethod || "").toUpperCase().replace(" ", "_");
        if (pm === "BANK_TRANSFER" || pm === "UPI" || pm === "CASH" || pm === "CARD" || pm === "CHEQUE") {
            mappedMethod = pm;
        }

        createPayload.payments = {
            create: {
                amount: data.amount,
                method: mappedMethod,
                transactionId: transactionId || null,
                status: "SUCCESS" // PaymentStatus Enum
            }
        };
    }

    return prisma.invoice.create({
        data: createPayload,
    });
}

export async function updateInvoice(
    invoiceId: string,
    data: any
) {
    const { paymentMethod, transactionId, paymentDate, ...invoiceData } = data;

    // Fetch existing invoice to prevent duplicate payments on repeated PAID updates
    const existingInvoice = await prisma.invoice.findUnique({
        where: { id: invoiceId }
    });

    if (!existingInvoice) {
        throw new Error("Invoice not found");
    }

    // Build the update payload
    const updatePayload: any = {
        ...invoiceData
    };

    // If the status is changing to PAID and it wasn't already PAID, create the nested Payment
    if (data.status === "PAID" && existingInvoice.status !== "PAID") {
        let mappedMethod = "OTHER";
        const pm = (paymentMethod || "").toUpperCase().replace(" ", "_");
        if (pm === "BANK_TRANSFER" || pm === "UPI" || pm === "CASH" || pm === "CARD" || pm === "CHEQUE") {
            mappedMethod = pm;
        }

        updatePayload.payments = {
            create: {
                amount: data.amount !== undefined ? data.amount : existingInvoice.amount,
                method: mappedMethod,
                transactionId: transactionId || null,
                status: "SUCCESS"
            }
        };
    }

    return prisma.invoice.update({
        where: { id: invoiceId },
        data: updatePayload,
    });
}

export async function deleteInvoice(invoiceId: string) {
    return prisma.invoice.delete({
        where: { id: invoiceId },
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
            client: { select: { name: true, email: true, company: true, phone: true } },
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
            client: { select: { name: true, email: true, company: true, phone: true } },
        },
    });
}

export async function getInvoiceById(invoiceId: string) {
    return prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
            client: { select: { name: true, email: true, company: true, phone: true } },
            project: { select: { title: true } },
            payments: true,
        },
    });
}
