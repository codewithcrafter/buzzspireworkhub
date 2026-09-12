import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { getBlog, updateBlog, deleteBlog } from "@/services/blog.service";
import { BlogStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// GET: Fetch a single blog by ID for admin form population
export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await authenticateRequest(req, { requiredAnyPermission: ["BLOG_MANAGE", "BLOG_CREATE"] });
        if (!auth.authenticated) return auth.response;
        const params = await props.params;
        const id = params.id;

        const blog = await getBlog(id, false);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error: any) {
        console.error("Admin Single Blog GET Error:", error);
        
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT: Update blog details
export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await authenticateRequest(req, { requiredAnyPermission: ["BLOG_MANAGE", "BLOG_CREATE"] });
        if (!auth.authenticated) return auth.response;
        const params = await props.params;
        const id = params.id;
        const body = await req.json();

        // Check if blog exists first
        const existing = await getBlog(id, false);
        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Normalize status
        const incomingStatus = body.status ? body.status.toString().toUpperCase() : undefined;

        if (incomingStatus === "SCHEDULED") {
            if (!body.scheduledAt) {
                return NextResponse.json(
                    { error: "Scheduled date and time are required" },
                    { status: 400 }
                );
            }
            const scheduledDate = new Date(body.scheduledAt);
            if (isNaN(scheduledDate.getTime())) {
                return NextResponse.json(
                    { error: "Invalid scheduled date/time format." },
                    { status: 400 }
                );
            }
            if (scheduledDate.getTime() <= Date.now()) {
                return NextResponse.json(
                    { error: "Please select a future date and time." },
                    { status: 400 }
                );
            }
        }

        const data: Partial<{
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
        }> = {};

        if (body.title !== undefined) data.title = body.title;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.excerpt !== undefined) data.excerpt = body.excerpt;
        if (body.content !== undefined) data.content = body.content;
        if (body.featuredImage !== undefined) data.featuredImage = body.featuredImage || null;
        if (body.category !== undefined) data.category = body.category;
        if (body.tags !== undefined) data.tags = Array.isArray(body.tags) ? body.tags : [];
        if (body.author !== undefined) data.author = body.author;
        // Sanitize authorId — empty string becomes null
        if (body.authorId !== undefined) {
            data.authorId = body.authorId && typeof body.authorId === "string" && body.authorId.trim()
                ? body.authorId.trim()
                : null;
        }
        if (body.readTime !== undefined) data.readTime = parseInt(String(body.readTime), 10);
        if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle || null;
        if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription || null;
        if (incomingStatus !== undefined) data.status = incomingStatus as BlogStatus;
        if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured === true;
        // Only write scheduledAt when SCHEDULED; clear it otherwise
        if (incomingStatus === "SCHEDULED" && body.scheduledAt) {
            data.scheduledAt = new Date(body.scheduledAt);
        } else if (incomingStatus && incomingStatus !== "SCHEDULED") {
            data.scheduledAt = null;
        }
        if (body.faqs !== undefined && Array.isArray(body.faqs)) data.faqs = body.faqs;

        const updatedBlog = await updateBlog(id, data);

        // Revalidate public blog pages safely
        try {
            revalidatePath("/blog");
            if (updatedBlog.slug) {
                revalidatePath(`/blog/${updatedBlog.slug}`);
            }
        } catch (revalErr) {
            console.warn("[Blog PUT] Cache revalidation skipped:", revalErr);
        }

        return NextResponse.json(
            { message: "Blog updated successfully", blog: updatedBlog },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Admin Blog PUT Error — full exception:", {
            message: error?.message,
            code: error?.code,
            meta: error?.meta,
            name: error?.name,
        });
        
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A blog with this slug already exists." },
                { status: 400 }
            );
        }
        if (error.code === "P2003" || error.code === "P2025") {
            return NextResponse.json(
                { error: "Invalid reference: the selected author does not exist." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Unable to update blog. Please try again." },
            { status: 500 }
        );
    }
}

// DELETE: Remove a blog post
export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await authenticateRequest(req, { requiredRole: "ADMIN" });
        if (!auth.authenticated) return auth.response;
        const params = await props.params;
        const id = params.id;

        const existing = await getBlog(id, false);
        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        await deleteBlog(id);

        return NextResponse.json(
            { message: "Blog deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Admin Blog DELETE Error:", error);
        
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
