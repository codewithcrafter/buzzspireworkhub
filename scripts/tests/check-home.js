const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({ where: { slug: 'home' } });
  console.log(JSON.stringify(page.publishedContent, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
