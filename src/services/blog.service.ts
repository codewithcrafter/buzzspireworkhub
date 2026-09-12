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
    authorId?: string | null;
    readTime?: number;
    seoTitle?: string;
    metaDescription?: string;
    status?: BlogStatus;
    isFeatured?: boolean;
    publishedAt?: Date;
    scheduledAt?: Date | null;
    faqs?: { question: string; answer: string; order?: number }[];
}) {
    const finalSlug = data.slug 
        ? await generateUniqueSlug(data.slug)
        : await generateUniqueSlug(data.title);

    let publishedAtVal = data.publishedAt;
    if (data.status === BlogStatus.PUBLISHED && !publishedAtVal) {
        publishedAtVal = new Date();
    }

    const createData: any = {
        title: data.title,
        slug: finalSlug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags,
        author: data.author,
        readTime: data.readTime ?? 5,
        status: data.status || "DRAFT",
        isFeatured: data.isFeatured ?? false,
    };

    if (data.featuredImage) createData.featuredImage = data.featuredImage;
    if (data.seoTitle) createData.seoTitle = data.seoTitle;
    if (data.metaDescription) createData.metaDescription = data.metaDescription;
    if (publishedAtVal) createData.publishedAt = publishedAtVal;
    if (data.scheduledAt) createData.scheduledAt = data.scheduledAt;

    if (data.authorId && data.authorId.trim()) {
        createData.authorProfile = { connect: { id: data.authorId.trim() } };
    }

    if (data.faqs && data.faqs.length > 0) {
        createData.faqs = {
            create: data.faqs.map((f, i) => ({
                question: f.question,
                answer: f.answer,
                order: f.order ?? i,
            })),
        };
    }

    return prisma.blog.create({
        data: createData,
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
        authorId: string | null;
        readTime: number;
        seoTitle: string | null;
        metaDescription: string | null;
        status: BlogStatus;
        isFeatured: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        faqs: { id?: string; question: string; answer: string; order?: number }[];
    }>
) {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug) {
        updateData.slug = await generateUniqueSlug(data.slug, id);
    }
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.featuredImage) updateData.featuredImage = data.featuredImage;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.authorId !== undefined) {
        if (data.authorId && data.authorId.trim()) {
            updateData.authorProfile = { connect: { id: data.authorId.trim() } };
        } else {
            updateData.authorProfile = { disconnect: true };
        }
    }
    if (data.readTime !== undefined) updateData.readTime = data.readTime;
    if (data.seoTitle) updateData.seoTitle = data.seoTitle;
    if (data.metaDescription) updateData.metaDescription = data.metaDescription;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    if (data.status === BlogStatus.PUBLISHED) {
        if (data.publishedAt !== undefined) {
            updateData.publishedAt = data.publishedAt;
        } else {
            updateData.publishedAt = new Date();
        }
    } else if (data.status === BlogStatus.SCHEDULED) {
        if (data.scheduledAt) updateData.scheduledAt = data.scheduledAt;
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
            include: { faqs: { orderBy: { order: 'asc' } }, authorProfile: true },
        });
    }
    return prisma.blog.findUnique({
        where: { id: idOrSlug },
        include: { faqs: { orderBy: { order: 'asc' } }, authorProfile: true },
    });
}

export async function publishDueScheduledBlogs(): Promise<number> {
    const now = new Date();
    const dueBlogs = await prisma.blog.findMany({
        where: {
            status: BlogStatus.SCHEDULED,
            scheduledAt: { lte: now },
        },
    });

    if (dueBlogs.length === 0) return 0;

    let publishedCount = 0;
    for (const blog of dueBlogs) {
        const updated = await prisma.blog.updateMany({
            where: { id: blog.id, status: BlogStatus.SCHEDULED },
            data: {
                status: BlogStatus.PUBLISHED,
                publishedAt: now,
                scheduledAt: null,
            },
        });

        if (updated.count > 0) {
            publishedCount++;
            try {
                const { revalidatePath } = await import("next/cache");
                revalidatePath("/blog");
                revalidatePath(`/blog/${blog.slug}`);
                revalidatePath("/api/blogs");
                revalidatePath(`/api/blogs/${blog.slug}`);
            } catch (revalErr) {
                // Ignore cache revalidation errors if invoked outside Next server request context
            }
        }
    }
    return publishedCount;
}

export async function getBlogs(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: BlogStatus;
    isFeatured?: boolean;
}) {
    // If requesting published blogs, auto-publish any scheduled blogs that have reached their scheduledAt time
    if (options.status === BlogStatus.PUBLISHED) {
        await publishDueScheduledBlogs();
    }

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
            include: { faqs: { orderBy: { order: 'asc' } }, authorProfile: true },
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
