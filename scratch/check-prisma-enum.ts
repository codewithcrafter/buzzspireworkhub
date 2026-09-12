import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { BlogStatus } from "@prisma/client";

async function checkEnum() {
  console.log("BlogStatus enum values in @prisma/client:", BlogStatus);

  try {
    const res = await prisma.blog.create({
      data: {
        title: "Test Enum Check " + Date.now(),
        slug: "test-enum-check-" + Date.now(),
        excerpt: "excerpt",
        content: "content",
        category: "Marketing",
        author: "Admin",
        status: BlogStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() + 86400000),
      }
    });
    console.log("SUCCESS creating scheduled blog:", res.id, res.status, res.scheduledAt);
    
    // Clean up test blog
    await prisma.blog.delete({ where: { id: res.id } });
    console.log("Test blog deleted cleanly.");
  } catch (err: any) {
    console.error("ERROR creating scheduled blog with Prisma directly:", {
      message: err.message,
      code: err.code,
      meta: err.meta,
      name: err.name
    });
  } finally {
    await prisma.$disconnect();
  }
}

checkEnum();
