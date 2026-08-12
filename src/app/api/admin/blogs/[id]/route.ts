import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { getBlog, updateBlog, deleteBlog } from "@/services/blog.service";
import { BlogStatus } from "@prisma/client";

// Helper to authenticate administrator requests
async function authenticateAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const payload = await verifyJwt(token);

    if (!payload || payload.role !== "ADMIN") {
        throw new Error("Forbidden");
    }

    return payload;
}

// GET: Fetch a single blog by ID for admin form population
export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await authenticateAdmin();
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
        await authenticateAdmin();
        const params = await props.params;
        const id = params.id;
        const body = await req.json();

        // Check if blog exists first
        const existing = await getBlog(id, false);
        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
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
            readTime: number;
            seoTitle: string | null;
            metaDescription: string | null;
            status: BlogStatus;
            isFeatured: boolean;
            publishedAt: Date | null;
        }> = {};

        if (body.title !== undefined) data.title = body.title;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.excerpt !== undefined) data.excerpt = body.excerpt;
        if (body.content !== undefined) data.content = body.content;
        if (body.featuredImage !== undefined) data.featuredImage = body.featuredImage;
        if (body.category !== undefined) data.category = body.category;
        if (body.tags !== undefined) data.tags = body.tags;
        if (body.author !== undefined) data.author = body.author;
        if (body.readTime !== undefined) data.readTime = parseInt(body.readTime, 10);
        if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle;
        if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription;
        if (body.status !== undefined) data.status = body.status;
        if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;

        const updatedBlog = await updateBlog(id, data);

        return NextResponse.json(
            { message: "Blog updated successfully", blog: updatedBlog },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Admin Blog PUT Error:", error);
        
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

// DELETE: Remove a blog post
export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await authenticateAdmin();
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
