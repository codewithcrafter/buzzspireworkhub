import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { signJwt } from "../src/lib/auth";

async function test() {
  try {
    const blogs = await prisma.blog.findMany({ take: 5, include: { faqs: true } });
    console.log("Found blogs:", blogs.map(b => ({ id: b.id, title: b.title, status: b.status })));
    
    if (blogs.length > 0) {
      const blog = blogs[0];
      console.log("\nTesting update for blog:", blog.id);

      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!admin) throw new Error("No admin user found");
      const adminToken = await signJwt({ id: admin.id, email: admin.email, role: admin.role });

      const updateData = {
        title: blog.title + " (Edit Test)",
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage,
        category: blog.category,
        tags: blog.tags,
        author: blog.author,
        authorId: blog.authorId,
        readTime: blog.readTime,
        seoTitle: blog.seoTitle,
        metaDescription: blog.metaDescription,
        status: blog.status,
        isFeatured: blog.isFeatured,
        faqs: blog.faqs,
      };

      console.log("\nSending PUT request to http://localhost:3000/api/admin/blogs/" + blog.id);
      const res = await fetch(`http://localhost:3000/api/admin/blogs/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
          "Cookie": `token=${adminToken}`
        },
        body: JSON.stringify(updateData),
      });

      console.log("Response HTTP status:", res.status);
      const jsonRes = await res.json();
      console.log("Response JSON:", JSON.stringify(jsonRes, null, 2));
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
