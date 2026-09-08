import { prisma } from './src/lib/prisma';

async function main() {
    try {
        const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
        if (!client) {
            console.log("No client found");
            return;
        }

        console.log("Found client:", client.id);

        const data = {
            clientId: client.id,
            amount: 50000,
            service: "Digital Marketing",
            description: "Test",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456",
            paymentDate: new Date("2026-08-27"),
            status: "PAID"
        };
        
        console.log("Creating invoice with data:", data);

        const newInvoice = await prisma.invoice.create({
            data: {
                ...data,
                invoiceNumber: `BSM-INV-TEST`,
            } as any, // bypassing TS for quick test
        });
        
        console.log("Invoice created:", newInvoice.id);

        console.log("Creating client payment...");
        await prisma.clientPayment.create({
            data: {
                clientId: data.clientId,
                amount: newInvoice.amount,
                description: data.service || "Invoice Payment",
                method: data.paymentMethod || "Other",
                date: data.paymentDate ? new Date(data.paymentDate) : new Date(),
                status: "PAID"
            }
        });
        console.log("Client payment created.");

    } catch (error) {
        console.error("ACTUAL EXCEPTION:", error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
