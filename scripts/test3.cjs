const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const blogs = await prisma.blog.findMany({ select: { id: true, title: true, featuredImage: true } });
  console.log(JSON.stringify(blogs.slice(0, 5), null, 2));
}
run();
