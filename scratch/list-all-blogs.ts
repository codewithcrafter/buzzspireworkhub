import { prisma } from "../src/lib/prisma";

async function main() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log(`TOTAL_BLOG_COUNT=${blogs.length}`);
  blogs.forEach((b, i) => {
    console.log(JSON.stringify({
      index: i + 1,
      id: b.id,
      title: b.title,
      slug: b.slug,
      status: b.status,
      category: b.category,
      author: b.author,
      createdAt: b.createdAt.toISOString(),
      scheduledAt: b.scheduledAt ? b.scheduledAt.toISOString() : null,
      publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
    }));
  });
}

main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
