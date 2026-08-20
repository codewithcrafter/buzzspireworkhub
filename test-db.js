const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.chatSession.count();
  console.log('ChatSession count:', count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
