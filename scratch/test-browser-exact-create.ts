import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function testBrowserExactCreate() {
  console.log("=== TESTING BROWSER-EXACT CREATE PAYLOADS ===");

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No admin user");
  const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

  // Minimal Payload exactly matching handleAddSubmit for "Direct Create Test"
  const minimalPayload = {
    title: "Direct Create Test " + Date.now(),
    slug: "direct-create-test-" + Date.now(),
    excerpt: "A short excerpt",
    content: "This is test content.",
    featuredImage: undefined,
    category: "Marketing",
    tags: ["General"],
    author: undefined,
    authorId: undefined,
    readTime: 5,
    seoTitle: undefined,
    metaDescription: undefined,
    status: "DRAFT",
    isFeatured: false,
    scheduledAt: undefined,
    faqs: []
  };

  console.log("Sending Minimal POST request...");
  const res = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify(minimalPayload),
  });

  console.log("Minimal POST Status:", res.status);
  const json = await res.json();
  console.log("Minimal POST Response:", JSON.stringify(json, null, 2));

  await prisma.$disconnect();
}

testBrowserExactCreate().catch(console.error);
