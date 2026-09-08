const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(blogs.map(b => ({ id: b.id, title: b.title, status: b.status, publishedAt: b.publishedAt })));
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
