const { prisma } = require("./src/lib/prisma");

async function test() {
  try {
    const blogs = await prisma.blog.findMany({ take: 5, include: { faqs: true } });
    console.log("Found blogs:", blogs.map(b => ({ id: b.id, title: b.title, status: b.status })));
    
    if (blogs.length > 0) {
      const blog = blogs[0];
      console.log("Testing update for blog:", blog.id);
      
      const updateData = {
        title: blog.title + " (Edit Test UI Debug)",
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

      const res = await fetch(`http://localhost:3000/api/admin/blogs/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Send request without authorization header first to test guard response, then test with cookie/token
        },
        body: JSON.stringify(updateData),
      });

      console.log("Response HTTP status without auth:", res.status);
      const jsonNoAuth = await res.json();
      console.log("Response JSON without auth:", JSON.stringify(jsonNoAuth, null, 2));
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
