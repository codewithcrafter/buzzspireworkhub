const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Get any client ID
        const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
        if (!client) {
            console.log("No client found");
            return;
        }

        const data = {
            clientId: client.id,
            amount: 50000,
            service: "Digital Marketing",
            description: "Test",
            subtotal: undefined,
            tax: undefined,
            discount: undefined,
            notes: "",
            paymentMethod: "Bank Transfer",
            transactionId: "TXN123456",
            paymentDate: new Date("2026-08-27"),
            status: "PAID"
        };
        
        console.log("Creating invoice...");
        const invNumber = data.invoiceNumber || `BSM-INV-${Math.floor(1000 + Math.random() * 9000)}`;

        const newInvoice = await prisma.invoice.create({
            data: {
                ...data,
                invoiceNumber: invNumber,
                status: data.status || "DRAFT",
            },
        });
        
        console.log("Invoice created:", newInvoice.id);

        if (data.status === "PAID") {
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
        }

    } catch (error) {
        console.error("ACTUAL EXCEPTION:", error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
