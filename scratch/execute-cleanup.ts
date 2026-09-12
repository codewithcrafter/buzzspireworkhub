import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== EXECUTING CLEANUP OF DEMO / TEST BLOGS ONLY ===");

  const legitimateBlogId = "a6c257ab-6f7a-4a51-93bc-43e52bc316f6";

  const blogsToDelete = await prisma.blog.findMany({
    where: {
      id: {
        not: legitimateBlogId,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
    },
  });

  console.log(`Identified ${blogsToDelete.length} demo/test blog records to delete.`);
  blogsToDelete.forEach((b, i) => {
    console.log(`${i + 1}. Delete ID: ${b.id} | Title: "${b.title}" | Status: ${b.status}`);
  });

  const deleteResult = await prisma.blog.deleteMany({
    where: {
      id: {
        not: legitimateBlogId,
      },
    },
  });

  console.log(`\nSuccessfully deleted ${deleteResult.count} demo/test blog records.`);

  const remainingBlogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      category: true,
      author: true,
      publishedAt: true,
    },
  });

  console.log(`\n=== REMAINING LEGITIMATE BLOGS IN DATABASE (${remainingBlogs.length}) ===`);
  remainingBlogs.forEach((b) => {
    console.log(JSON.stringify(b, null, 2));
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
