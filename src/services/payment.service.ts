import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function createPayment(
    invoiceId: string,
    amount: number,
    method?: string
) {
    return prisma.payment.create({
        data: {
            invoiceId,
            amount,
            method,
            status: "PENDING",
        },
    });
}

export async function updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus
) {
    // Transaction to update invoice status to PAID if payment is SUCCESS
    return prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
            where: { id: paymentId },
            data: { status },
        });

        if (status === "SUCCESS") {
            // Check total successful payments for the invoice
            const invoice = await tx.invoice.findUnique({
                where: { id: payment.invoiceId },
                include: { payments: true }
            });

            if (invoice) {
                const totalPaid = invoice.payments
                    .filter(p => p.status === "SUCCESS")
                    .reduce((sum, p) => sum + p.amount, 0);

                if (totalPaid >= invoice.amount) {
                    await tx.invoice.update({
                        where: { id: invoice.id },
                        data: { status: "PAID" }
                    });
                }
            }
        }

        return payment;
    });
}

export async function getAdminPayments() {
    return prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            invoice: {
                include: {
                    client: { select: { name: true, email: true } }
                }
            }
        },
    });
}

export async function getClientPayments(clientId: string) {
    return prisma.payment.findMany({
        where: {
            invoice: { clientId }
        },
        orderBy: { createdAt: "desc" },
        include: {
            invoice: { select: { amount: true, projectId: true } }
        },
    });
}
