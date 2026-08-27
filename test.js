const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const client = await prisma.user.findFirst({
        where: { company: "Anantyakrit Solutions" }
    });
    
    if (!client) {
        console.log("Client not found");
        return;
    }
    console.log("Client:", client.id, client.company, "Budget:", client.contractAmount);
    
    const clientPayments = await prisma.clientPayment.findMany({
        where: { clientId: client.id }
    });
    console.log("--- Client Payments ---");
    console.dir(clientPayments, { depth: null });
    
    const invoicePayments = await prisma.payment.findMany({
        where: { invoice: { clientId: client.id } },
        include: { invoice: true }
    });
    console.log("--- Invoice Payments ---");
    console.dir(invoicePayments, { depth: null });
}

main().finally(() => prisma.$disconnect());
