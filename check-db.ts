import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking recent VoiceCalls...");
    const calls = await prisma.voiceCall.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { signals: true }
    });

    for (const call of calls) {
        console.log(`Call ID: ${call.id} | Status: ${call.status} | CreatedAt: ${call.createdAt}`);
        console.log(`  Signals: ${call.signals.length}`);
        for (const sig of call.signals) {
            console.log(`    - ${sig.type} from ${sig.senderType} at ${sig.createdAt}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
