import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { getAuthors, createAuthor } from "@/services/author.service";

export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req, { requiredPermission: "BLOG_MANAGE" });
    if (!auth.authenticated) return auth.response;

    const authors = await getAuthors();
    return NextResponse.json({ authors, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Authors GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, { requiredPermission: "BLOG_MANAGE" });
    if (!auth.authenticated) return auth.response;

    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const author = await createAuthor({
      name: body.name,
      photoUrl: body.photoUrl,
      designation: body.designation,
      bio: body.bio,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      linkedinUrl: body.linkedinUrl,
    });

    return NextResponse.json({ message: "Author created successfully", author, success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Admin Authors POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
