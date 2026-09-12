import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function testMinimalPost() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No admin found");
  const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

  const payload = {
    title: "Direct Create Test",
    slug: "direct-create-test",
    excerpt: "A short excerpt",
    content: "This is test content.",
    category: "Marketing"
  };

  console.log("Sending Minimal POST to http://localhost:3000/api/admin/blogs...");
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

testMinimalPost().catch(console.error);
