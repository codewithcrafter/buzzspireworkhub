import { prisma } from './src/lib/prisma';

async function run() {
    try {
        const user = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
        if (!user) {
            console.log('No client found');
            return;
        }
        const inv = await prisma.invoice.create({
            data: {
                clientId: user.id,
                amount: 1000,
                invoiceNumber: 'TEST-INV-001',
                service: 'Test Service',
                description: 'Test',
                status: 'PAID',
                payments: {
                    create: {
                        amount: 1000,
                        method: 'BANK_TRANSFER',
                        transactionId: 'TEST-TXN-123456',
                        status: 'SUCCESS'
                    }
                }
            },
            include: { payments: true }
        });
        console.log('Created invoice:', inv.id);
        console.log('Nested payment transactionId:', inv.payments[0].transactionId);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
run();
