import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function testScheduledPost() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No admin found");
  const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

  const scheduledDate = new Date(Date.now() + 86400000 * 7).toISOString();

  const payload = {
    title: "Scheduled Blog Test " + Date.now(),
    slug: "scheduled-blog-test-" + Date.now(),
    excerpt: "Scheduled test excerpt",
    content: "Scheduled test content",
    category: "Marketing",
    status: "SCHEDULED",
    scheduledAt: scheduledDate,
  };

  console.log("Sending SCHEDULED POST request...");
  const res = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`,
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify(payload),
  });

  console.log("Response HTTP Status:", res.status);
  const data = await res.json();
  console.log("Response Body:", JSON.stringify(data, null, 2));

  await prisma.$disconnect();
}

testScheduledPost().catch(console.error);
