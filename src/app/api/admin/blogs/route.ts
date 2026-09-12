import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { getBlogs, createBlog } from "@/services/blog.service";
import { BlogStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// GET: List all blogs for administration (includes Drafts & Archives)
export async function GET(req: Request) {
    try {
        const auth = await authenticateRequest(req, { requiredAnyPermission: ["BLOG_MANAGE", "BLOG_CREATE"] });
        if (!auth.authenticated) return auth.response;
        
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const category = searchParams.get("category") || undefined;
        const search = searchParams.get("search") || undefined;
        const status = (searchParams.get("status") as BlogStatus) || undefined;
        const featuredParam = searchParams.get("featured");

        let isFeatured: boolean | undefined = undefined;
        if (featuredParam === "true") {
            isFeatured = true;
        } else if (featuredParam === "false") {
            isFeatured = false;
        }

        const data = await getBlogs({
            page,
            limit,
            category,
            search,
            status,
            isFeatured,
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("Admin Blogs GET Error:", error);
        
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

// POST: Register a new blog post
export async function POST(req: Request) {
    try {
        const auth = await authenticateRequest(req, { requiredAnyPermission: ["BLOG_MANAGE", "BLOG_CREATE"] });
        if (!auth.authenticated) return auth.response;

        const body = await req.json();

        if (!body.title || !body.title.trim()) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        if (!body.content || !body.content.trim()) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        if (!body.category || !body.category.trim()) {
            return NextResponse.json(
                { error: "Category is required" },
                { status: 400 }
            );
        }

        // Validate status is a known enum value
        const validStatuses = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"];
        const incomingStatus = (body.status || "DRAFT").toString().toUpperCase();
        if (!validStatuses.includes(incomingStatus)) {
            return NextResponse.json(
                { error: `Invalid status value: '${body.status}'.` },
                { status: 400 }
            );
        }

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

        // Sanitize authorId — reject empty strings, pass only valid UUIDs or null
        const authorId: string | null = body.authorId && typeof body.authorId === "string" && body.authorId.trim()
            ? body.authorId.trim()
            : null;

        // Only pass scheduledAt when status is SCHEDULED
        const scheduledAt: Date | null = incomingStatus === "SCHEDULED" && body.scheduledAt
            ? new Date(body.scheduledAt)
            : null;

        const blog = await createBlog({
            title: body.title,
            slug: body.slug || undefined,
            excerpt: body.excerpt || "",
            content: body.content,
            featuredImage: body.featuredImage || undefined,
            category: body.category,
            tags: Array.isArray(body.tags) ? body.tags : [],
            author: body.author || auth.user.name || "Administrator",
            authorId,
            readTime: body.readTime ? parseInt(String(body.readTime), 10) : undefined,
            seoTitle: body.seoTitle || undefined,
            metaDescription: body.metaDescription || undefined,
            status: incomingStatus as BlogStatus,
            isFeatured: body.isFeatured === true,
            scheduledAt,
            faqs: Array.isArray(body.faqs) ? body.faqs : undefined,
        });

        // Revalidate public blog pages safely
        try {
            revalidatePath("/blog");
            if (blog.slug) {
                revalidatePath(`/blog/${blog.slug}`);
            }
        } catch (revalErr) {
            console.warn("[Blog POST] Cache revalidation skipped:", revalErr);
        }

        return NextResponse.json(
            { message: "Blog created successfully", blog },
            { status: 201 }
        );
    } catch (error: any) {
        // Log the full server-side error for safe diagnosis (never exposed to client)
        console.error("Admin Blog POST Error — full exception:", {
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

        // Prisma unique constraint violation (duplicate slug)
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A blog with this slug already exists. Please use a different title or slug." },
                { status: 400 }
            );
        }
        // Prisma foreign key / relation not found
        if (error.code === "P2003" || error.code === "P2025") {
            return NextResponse.json(
                { error: "Invalid reference: the selected author does not exist." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Unable to save blog. Please try again." },
            { status: 500 }
        );
    }
}

