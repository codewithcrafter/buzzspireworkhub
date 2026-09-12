import { NextResponse } from "next/server";
import { publishDueScheduledBlogs } from "@/services/blog.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publishedCount = await publishDueScheduledBlogs();

    if (publishedCount === 0) {
      return NextResponse.json({ message: "No blogs to publish" }, { status: 200 });
    }

    return NextResponse.json({ message: `Successfully published ${publishedCount} blogs` }, { status: 200 });
  } catch (error) {
    console.error("Scheduled Blogs Publication Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
