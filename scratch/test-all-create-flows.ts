import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function runAllCreateTests() {
  console.log("=== STARTING COMPLETE BLOG CREATE FLOW SUITE ===");

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No admin found");
  const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

  let author = await prisma.author.findFirst();
  if (!author) {
    author = await prisma.author.create({
      data: { name: "Test Author " + Date.now() }
    });
  }

  // TEST 1: Minimal Blog
  console.log("\n[TEST 1] Minimal Blog Create...");
  const res1 = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Test Minimal Blog " + Date.now(),
      content: "This is test minimal content.",
      category: "Marketing",
    }),
  });
  console.log("TEST 1 Status:", res1.status);
  const json1 = await res1.json();
  console.log("TEST 1 Result:", res1.status === 201 ? "PASS" : "FAIL", json1.message || json1.error);

  // TEST 2: Blog with Author Profile
  console.log("\n[TEST 2] Blog with Author...");
  const res2 = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Test Blog With Author " + Date.now(),
      content: "Content with author.",
      category: "SEO",
      author: author.name,
      authorId: author.id,
    }),
  });
  console.log("TEST 2 Status:", res2.status);
  const json2 = await res2.json();
  console.log("TEST 2 Result:", res2.status === 201 ? "PASS" : "FAIL", json2.message || json2.error);

  // TEST 3: Blog with Image
  console.log("\n[TEST 3] Blog with Image...");
  const res3 = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Test Blog With Image " + Date.now(),
      content: "Content with image.",
      category: "Strategy",
      featuredImage: "/uploads/blogs/test-image.jpg",
    }),
  });
  console.log("TEST 3 Status:", res3.status);
  const json3 = await res3.json();
  console.log("TEST 3 Result:", res3.status === 201 ? "PASS" : "FAIL", json3.message || json3.error);

  // TEST 4: Blog with Custom Category
  console.log("\n[TEST 4] Blog with Custom Category...");
  const res4 = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Test Blog Custom Category " + Date.now(),
      content: "Content custom cat.",
      category: "AI Growth Marketing",
    }),
  });
  console.log("TEST 4 Status:", res4.status);
  const json4 = await res4.json();
  console.log("TEST 4 Result:", res4.status === 201 ? "PASS" : "FAIL", json4.message || json4.error);

  // TEST 5: Scheduled Blog
  console.log("\n[TEST 5] Scheduled Blog...");
  const futureDate = new Date(Date.now() + 86400000 * 7).toISOString();
  const res5 = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Test Scheduled Blog " + Date.now(),
      content: "Content scheduled.",
      category: "MarTech",
      status: "SCHEDULED",
      scheduledAt: futureDate,
    }),
  });
  console.log("TEST 5 Status:", res5.status);
  const json5 = await res5.json();
  console.log("TEST 5 Result:", res5.status === 201 ? "PASS" : "FAIL", json5.message || json5.error, json5.debugDetail || "");

  // TEST 6: Blog with FAQs
  console.log("\n[TEST 6] Blog with FAQs...");
  const res6 = await fetch("http://localhost:3000/api/admin/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}`, "Cookie": `token=${adminToken}` },
    body: JSON.stringify({
      title: "Test Blog With FAQs " + Date.now(),
      content: "Content with FAQs.",
      category: "Design",
      faqs: [
        { question: "What is this?", answer: "This is a test FAQ." },
        { question: "How does it work?", answer: "It works automatically." }
      ],
    }),
  });
  console.log("TEST 6 Status:", res6.status);
  const json6 = await res6.json();
  console.log("TEST 6 Result:", res6.status === 201 ? "PASS" : "FAIL", json6.message || json6.error);

  // TEST 7: Employee with BLOG_CREATE permission
  console.log("\n[TEST 7] Employee with BLOG_CREATE permission...");
  let empUser = await prisma.user.findFirst({ where: { role: "EMPLOYEE", permissions: { has: "BLOG_CREATE" } } });
  if (!empUser) {
    empUser = await prisma.user.findFirst({ where: { role: "EMPLOYEE" } });
    if (empUser) {
      await prisma.user.update({
        where: { id: empUser.id },
        data: { permissions: ["BLOG_CREATE"] }
      });
    }
  }

  if (empUser) {
    const empToken = await signJwt({ id: empUser.id, email: empUser.email, role: empUser.role });
    const res7 = await fetch("http://localhost:3000/api/admin/blogs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${empToken}`,
        "Cookie": `employee_token=${empToken}`
      },
      body: JSON.stringify({
        title: "Employee Blog " + Date.now(),
        content: "Content by employee.",
        category: "Marketing",
      }),
    });
    console.log("TEST 7 Status:", res7.status);
    const json7 = await res7.json();
    console.log("TEST 7 Result:", res7.status === 201 ? "PASS" : "FAIL", json7.message || json7.error);
  } else {
    console.log("TEST 7 Skipped: No employee user found in DB.");
  }

  // TEST 8: Unauthorized employee
  console.log("\n[TEST 8] Unauthorized Employee (no BLOG_CREATE)...");
  let unauthEmp = await prisma.user.findFirst({ where: { role: "EMPLOYEE", NOT: { permissions: { has: "BLOG_CREATE" } } } });
  if (unauthEmp) {
    // Strip BLOG_CREATE and BLOG_MANAGE permissions
    const cleanPerms = unauthEmp.permissions.filter(p => p !== "BLOG_CREATE" && p !== "BLOG_MANAGE");
    await prisma.user.update({ where: { id: unauthEmp.id }, data: { permissions: cleanPerms } });

    const unauthEmpToken = await signJwt({ id: unauthEmp.id, email: unauthEmp.email, role: unauthEmp.role });
    const res8 = await fetch("http://localhost:3000/api/admin/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${unauthEmpToken}`,
        "Cookie": `employee_token=${unauthEmpToken}`
      },
      body: JSON.stringify({
        title: "Unauthorized Blog " + Date.now(),
        content: "Content by unauth employee.",
        category: "Marketing",
      }),
    });
    console.log("TEST 8 Status:", res8.status);
    const json8 = await res8.json();
    console.log("TEST 8 Result:", res8.status === 403 ? "PASS (403 Forbidden)" : "FAIL", json8.error);
  } else {
    console.log("TEST 8 Skipped: No employee user available for unauth test.");
  }

  console.log("\n=== ALL CREATE TESTS COMPLETED ===");
  await prisma.$disconnect();
}

runAllCreateTests().catch(console.error);
