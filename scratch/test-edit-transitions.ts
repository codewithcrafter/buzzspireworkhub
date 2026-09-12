import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function testEditTransitions() {
  console.log("=== TESTING EDIT STATUS TRANSITIONS ===");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No admin user");
  const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

  // 1. Create a draft blog
  const createRes = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Edit Transition Test Blog " + Date.now(),
      content: "Transition test content",
      category: "Marketing",
      status: "DRAFT"
    })
  });
  const createJson = await createRes.json();
  const blogId = createJson.blog.id;
  console.log("Created test blog ID:", blogId, "Initial status:", createJson.blog.status);

  // Transition 1: DRAFT -> SCHEDULED
  console.log("\n[TRANSITION 1] DRAFT -> SCHEDULED...");
  const futureDate1 = new Date(Date.now() + 86400000 * 5).toISOString();
  const put1 = await fetch(`http://localhost:3000/api/admin/blogs/${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      status: "SCHEDULED",
      scheduledAt: futureDate1
    })
  });
  console.log("Transition 1 Status:", put1.status);
  const putJson1 = await put1.status === 200 ? await put1.json() : null;
  console.log("Transition 1 Result:", put1.status === 200 ? "PASS" : "FAIL", putJson1?.blog?.status || "FAILED");

  // Transition 2: Reschedule (SCHEDULED -> new scheduledAt)
  console.log("\n[TRANSITION 2] Reschedule (SCHEDULED -> new date)...");
  const futureDate2 = new Date(Date.now() + 86400000 * 10).toISOString();
  const put2 = await fetch(`http://localhost:3000/api/admin/blogs/${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      status: "SCHEDULED",
      scheduledAt: futureDate2
    })
  });
  console.log("Transition 2 Status:", put2.status);
  const putJson2 = await put2.status === 200 ? await put2.json() : null;
  console.log("Transition 2 Result:", put2.status === 200 ? "PASS" : "FAIL", putJson2?.blog?.status || "FAILED");

  // Transition 3: SCHEDULED -> DRAFT
  console.log("\n[TRANSITION 3] SCHEDULED -> DRAFT...");
  const put3 = await fetch(`http://localhost:3000/api/admin/blogs/${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      status: "DRAFT"
    })
  });
  console.log("Transition 3 Status:", put3.status);
  const putJson3 = await put3.status === 200 ? await put3.json() : null;
  console.log("Transition 3 Result:", put3.status === 200 ? "PASS" : "FAIL", putJson3?.blog?.status || "FAILED");

  // Transition 4: DRAFT -> PUBLISHED
  console.log("\n[TRANSITION 4] DRAFT -> PUBLISHED...");
  const put4 = await fetch(`http://localhost:3000/api/admin/blogs/${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      status: "PUBLISHED"
    })
  });
  console.log("Transition 4 Status:", put4.status);
  const putJson4 = await put4.status === 200 ? await put4.json() : null;
  console.log("Transition 4 Result:", put4.status === 200 ? "PASS" : "FAIL", putJson4?.blog?.status || "FAILED");

  // Clean up
  await prisma.blog.delete({ where: { id: blogId } });
  console.log("\nCleaned up transition test blog.");
  await prisma.$disconnect();
}

testEditTransitions().catch(console.error);
