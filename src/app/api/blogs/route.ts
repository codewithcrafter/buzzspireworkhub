import { NextResponse } from "next/server";
import { getBlogs } from "@/services/blog.service";

// GET: Query published blogs for public view
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "9", 10);
        const category = searchParams.get("category") || undefined;
        const search = searchParams.get("search") || undefined;
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
            status: "PUBLISHED", // Force status to published for public endpoint
            isFeatured,
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Public Blogs Query Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
