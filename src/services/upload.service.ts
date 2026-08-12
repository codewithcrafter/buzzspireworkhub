import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
// 5MB maximum file size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
  filePath: string; // Relative path e.g., "/uploads/blogs/filename.webp"
}

export interface IStorageProvider {
  upload(file: File): Promise<UploadResult>;
}

// Local filesystem storage provider implementation (S3/Cloudinary/Supabase swappable)
export class LocalStorageProvider implements IStorageProvider {
  async upload(file: File): Promise<UploadResult> {
    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      throw new Error("Invalid file type. Allowed formats: JPG, JPEG, PNG, WEBP, SVG.");
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File is too large. Maximum size allowed is 5MB.");
    }

    // 3. Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Generate a unique and sanitized filename to prevent duplicates or directory traversal attacks
    const rawExtension = path.extname(file.name).toLowerCase();
    const extension = rawExtension || this.getExtensionFromMime(file.type);
    const randomHash = crypto.randomBytes(8).toString("hex");
    const sanitizedBase = file.name
      .toLowerCase()
      .replace(rawExtension, "")
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const filename = `${sanitizedBase}-${randomHash}${extension}`;

    // 5. Ensure the directory path public/uploads/blogs exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "blogs");
    await fs.mkdir(uploadDir, { recursive: true });

    // 6. Write file buffer to local disk
    const targetPath = path.join(uploadDir, filename);
    await fs.writeFile(targetPath, buffer);

    // Return only relative path starting with /uploads/blogs/
    return {
      filePath: `/uploads/blogs/${filename}`,
    };
  }

  private getExtensionFromMime(mimeType: string): string {
    switch (mimeType.toLowerCase()) {
      case "image/jpeg":
      case "image/jpg":
        return ".jpg";
      case "image/png":
        return ".png";
      case "image/webp":
        return ".webp";
      case "image/svg+xml":
        return ".svg";
      default:
        return "";
    }
  }
}

// Export the active configured storage client
const storageProvider: IStorageProvider = new LocalStorageProvider();

export async function uploadImage(file: File): Promise<UploadResult> {
  return storageProvider.upload(file);
}
