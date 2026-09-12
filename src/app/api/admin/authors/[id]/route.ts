import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { getAuthor, updateAuthor, deleteAuthor } from "@/services/author.service";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req, { requiredPermission: "BLOG_MANAGE" });
    if (!auth.authenticated) return auth.response;
    
    const params = await props.params;
    const author = await getAuthor(params.id);

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({ author, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Author GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req, { requiredPermission: "BLOG_MANAGE" });
    if (!auth.authenticated) return auth.response;

    const params = await props.params;
    const body = await req.json();

    const author = await updateAuthor(params.id, {
      name: body.name,
      photoUrl: body.photoUrl,
      designation: body.designation,
      bio: body.bio,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      linkedinUrl: body.linkedinUrl,
    });

    return NextResponse.json({ message: "Author updated successfully", author, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Author PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req, { requiredPermission: "BLOG_MANAGE" });
    if (!auth.authenticated) return auth.response;

    const params = await props.params;

    try {
      await deleteAuthor(params.id);
      return NextResponse.json({ message: "Author deleted successfully", success: true }, { status: 200 });
    } catch (dbError: any) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin Author DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
