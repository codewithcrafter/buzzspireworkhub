import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { getBlogs, createBlog } from "@/services/blog.service";
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

// GET: List all blogs for administration (includes Drafts & Archives)
export async function GET(req: Request) {
    try {
        await authenticateAdmin();
        
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
        const payload = await authenticateAdmin();
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

        const blog = await createBlog({
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt || "",
            content: body.content,
            featuredImage: body.featuredImage,
            category: body.category,
            tags: body.tags || [],
            author: body.author || payload.name || "Administrator",
            readTime: body.readTime ? parseInt(body.readTime, 10) : undefined,
            seoTitle: body.seoTitle,
            metaDescription: body.metaDescription,
            status: body.status || "DRAFT",
            isFeatured: body.isFeatured || false,
        });

        return NextResponse.json(
            { message: "Blog created successfully", blog },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Admin Blog POST Error:", error);
        
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
