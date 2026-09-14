import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { uploadImage } from "@/services/upload.service";

// POST: Handles secure image upload for blog posts
export async function POST(req: Request) {
  try {
    // 1. Authenticate administrator or authorized employee session
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: ["PAGES_EDIT", "BLOG_MANAGE", "CASE_STUDY_CREATE", "CASE_STUDY_EDIT"],
    });
    if (!auth.authenticated) return auth.response;

    // 2. Parse Multipart request body
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was selected for upload." },
        { status: 400 }
      );
    }

    // 3. Perform validation and filesystem write via service layer
    const result = await uploadImage(file);

    // 4. Return the successfully saved relative path
    return NextResponse.json(
      { message: "Image uploaded successfully", filePath: result.filePath },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Upload API Error:", error);

    // Filter and return specific error types
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If it's a validation error thrown by the upload provider service
    if (
      error.message.includes("Invalid file type") ||
      error.message.includes("File is too large")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
