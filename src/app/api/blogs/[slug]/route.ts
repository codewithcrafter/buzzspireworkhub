import { NextResponse } from "next/server";
import { getBlog } from "@/services/blog.service";

export const dynamic = "force-dynamic";

// GET: Securely fetch a single published blog by slug
export async function GET(
    req: Request,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        const slug = params.slug;

        const blog = await getBlog(slug, true);

        if (!blog || blog.status !== "PUBLISHED") {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error("Public Blog Detail GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
