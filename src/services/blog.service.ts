import { prisma } from "@/lib/prisma";
import { BlogStatus } from "@prisma/client";

// Generates a URL-safe unique slug. Extends automatically if collision is detected.
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    if (!slug) {
        slug = "post";
    }

    let count = 0;
    let uniqueSlug = slug;
    
    while (true) {
        const existing = await prisma.blog.findFirst({
            where: {
                slug: uniqueSlug,
                id: excludeId ? { not: excludeId } : undefined,
            },
        });
        if (!existing) break;
        count++;
        uniqueSlug = `${slug}-${count}`;
    }
    return uniqueSlug;
}

export async function createBlog(data: {
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category: string;
    tags: string[];
    author: string;
    readTime?: number;
    seoTitle?: string;
    metaDescription?: string;
    status?: BlogStatus;
    isFeatured?: boolean;
    publishedAt?: Date;
    faqs?: { question: string; answer: string; order?: number }[];
}) {
    const finalSlug = data.slug 
        ? await generateUniqueSlug(data.slug)
        : await generateUniqueSlug(data.title);

    let publishedAtVal = data.publishedAt;
    if (data.status === "PUBLISHED" && !publishedAtVal) {
        publishedAtVal = new Date();
    }

    return prisma.blog.create({
        data: {
            title: data.title,
            slug: finalSlug,
            excerpt: data.excerpt,
            content: data.content,
            featuredImage: data.featuredImage || null,
            category: data.category,
            tags: data.tags,
            author: data.author,
            readTime: data.readTime ?? 5,
            seoTitle: data.seoTitle || null,
            metaDescription: data.metaDescription || null,
            status: data.status || "DRAFT",
            isFeatured: data.isFeatured ?? false,
            publishedAt: publishedAtVal,
            faqs: data.faqs && data.faqs.length > 0 ? {
                create: data.faqs.map((f, i) => ({
                    question: f.question,
                    answer: f.answer,
                    order: f.order ?? i,
                })),
            } : undefined,
        },
    });
}

export async function updateBlog(
    id: string,
    data: Partial<{
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        author: string;
        readTime: number;
        seoTitle: string | null;
        metaDescription: string | null;
        status: BlogStatus;
        isFeatured: boolean;
        publishedAt: Date | null;
        faqs: { id?: string; question: string; answer: string; order?: number }[];
    }>
) {
    const updateData: any = { ...data };

    if (data.slug) {
        updateData.slug = await generateUniqueSlug(data.slug, id);
    } else if (data.title) {
        // If title changed but slug was not explicitly modified, keep existing slug
    }

    if (data.status === "PUBLISHED" && !data.publishedAt) {
        updateData.publishedAt = new Date();
    } else if (data.status === "DRAFT") {
        updateData.publishedAt = null;
    }

    if (data.faqs !== undefined) {
        updateData.faqs = {
            deleteMany: {},
            create: data.faqs.map((f, i) => ({
                question: f.question,
                answer: f.answer,
                order: f.order ?? i,
            })),
        };
    }

    return prisma.blog.update({
        where: { id },
        data: updateData,
    });
}

export async function getBlog(idOrSlug: string, isSlug: boolean = false) {
    if (isSlug) {
        return prisma.blog.findUnique({
            where: { slug: idOrSlug },
            include: { faqs: { orderBy: { order: 'asc' } } },
        });
    }
    return prisma.blog.findUnique({
        where: { id: idOrSlug },
        include: { faqs: { orderBy: { order: 'asc' } } },
    });
}

export async function getBlogs(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: BlogStatus;
    isFeatured?: boolean;
}) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options.status) {
        where.status = options.status;
    }
    
    if (options.category && options.category !== "All") {
        where.category = {
            equals: options.category,
            mode: "insensitive",
        };
    }

    if (options.isFeatured !== undefined) {
        where.isFeatured = options.isFeatured;
    }

    if (options.search) {
        where.OR = [
            { title: { contains: options.search, mode: "insensitive" } },
            { excerpt: { contains: options.search, mode: "insensitive" } },
            { content: { contains: options.search, mode: "insensitive" } },
        ];
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: { faqs: { orderBy: { order: 'asc' } } },
        }),
        prisma.blog.count({ where }),
    ]);

    return {
        blogs,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function deleteBlog(id: string) {
    return prisma.blog.delete({
        where: { id },
    });
}

export async function publishBlog(id: string) {
    return prisma.blog.update({
        where: { id },
        data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
        },
    });
}

export async function unpublishBlog(id: string) {
    return prisma.blog.update({
        where: { id },
        data: {
            status: "DRAFT",
            publishedAt: null,
        },
    });
}
