import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function testCreate() {
  try {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) throw new Error("No admin user found");
    const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

    const createPayload = {
      title: "Test Blog Create " + Date.now(),
      slug: "test-blog-create-" + Date.now(),
      excerpt: "This is a test blog excerpt",
      content: "This is test content.",
      category: "Marketing",
      tags: ["Marketing"],
      author: "Buzzspire Admin",
      authorId: null,
      readTime: 5,
      seoTitle: null,
      metaDescription: null,
      status: "DRAFT",
      isFeatured: false,
      scheduledAt: null,
      faqs: []
    };

    console.log("Sending POST request to http://localhost:3000/api/admin/blogs...");
    const res = await fetch("http://localhost:3000/api/admin/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`,
        "Cookie": `token=${adminToken}`
      },
      body: JSON.stringify(createPayload),
    });

    console.log("Response HTTP Status:", res.status);
    const jsonRes = await res.json();
    console.log("Response JSON:", JSON.stringify(jsonRes, null, 2));
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();
