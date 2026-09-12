import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== INSPECTING ALL BLOG RECORDS IN DATABASE ===");
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      faqs: true,
      authorProfile: true,
    },
  });

  console.log(`Total blogs found in database: ${blogs.length}\n`);

  blogs.forEach((b, index) => {
    console.log(`--- [Blog #${index + 1}] ---`);
    console.log(`ID: ${b.id}`);
    console.log(`Title: ${b.title}`);
    console.log(`Slug: ${b.slug}`);
    console.log(`Status: ${b.status}`);
    console.log(`Category: ${b.category}`);
    console.log(`Author: ${b.author}`);
    console.log(`AuthorProfile: ${b.authorProfile ? b.authorProfile.name : "null"}`);
    console.log(`CreatedAt: ${b.createdAt.toISOString()}`);
    console.log(`ScheduledAt: ${b.scheduledAt ? b.scheduledAt.toISOString() : "null"}`);
    console.log(`PublishedAt: ${b.publishedAt ? b.publishedAt.toISOString() : "null"}`);
    console.log(`Excerpt: ${b.excerpt.slice(0, 100)}...`);
    console.log(`FAQs count: ${b.faqs.length}`);
    console.log("");
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
