import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";
import { PUT } from "@/app/api/admin/blogs/[id]/route";

async function main() {
  const blogs = await prisma.blog.findMany({
    take: 10,
    include: { faqs: true, authorProfile: true },
  });
  console.log("Found blogs in DB:", blogs.length);
  for (const b of blogs) {
    console.log({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      author: b.author,
      authorId: b.authorId,
      status: b.status,
      faqsCount: b.faqs.length,
    });
  }

  if (blogs.length > 0) {
    const target = blogs[0];
    console.log("\nAttempting browser-exact PUT request for blog ID:", target.id);

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) throw new Error("No admin");
    const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

    // Payload exactly matching browser UI handleEditSubmit:
    const payload = {
      title: target.title + " (Edit Test)",
      slug: target.slug,
      excerpt: target.excerpt || target.content.slice(0, 150),
      content: target.content,
      featuredImage: target.featuredImage || null,
      category: target.category,
      tags: target.tags || ["General"],
      author: target.author,
      authorId: target.authorId || null,
      readTime: target.readTime || 5,
      seoTitle: target.seoTitle || null,
      metaDescription: target.metaDescription || null,
      status: target.status,
      isFeatured: target.isFeatured,
      scheduledAt: target.scheduledAt ? new Date(target.scheduledAt).toISOString() : undefined,
      faqs: target.faqs.map((f, i) => ({ question: f.question, answer: f.answer, order: i })),
    };

    console.log("Payload:", payload);

    const res = await fetch(`http://localhost:3000/api/admin/blogs/${target.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`,
        "Cookie": `token=${adminToken}`
      },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json();
    console.log("Response status:", res.status);
    console.log("Response JSON:", resJson);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
