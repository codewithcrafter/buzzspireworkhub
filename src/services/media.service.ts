import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Allowed image MIME types for CMS media
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"];

// 5MB maximum file size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getExtensionFromMime(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}

/**
 * Parse PNG/JPEG/WebP dimensions from buffer header bytes.
 */
function getImageDimensions(buffer: Buffer, mimeType: string): { width: number; height: number } | null {
  try {
    if (mimeType === "image/png" && buffer.length > 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      if (width > 0 && height > 0 && width < 100000 && height < 100000) {
        return { width, height };
      }
    }

    if ((mimeType === "image/jpeg" || mimeType === "image/jpg") && buffer.length > 2) {
      let offset = 2;
      while (offset < buffer.length - 1) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          if (offset + 9 < buffer.length) {
            const height = buffer.readUInt16BE(offset + 5);
            const width = buffer.readUInt16BE(offset + 7);
            if (width > 0 && height > 0) return { width, height };
          }
          break;
        }
        if (offset + 3 < buffer.length) {
          const segmentLength = buffer.readUInt16BE(offset + 2);
          offset += 2 + segmentLength;
        } else {
          break;
        }
      }
    }

    if (mimeType === "image/webp" && buffer.length > 30) {
      const riff = buffer.toString("ascii", 0, 4);
      const webp = buffer.toString("ascii", 8, 12);
      if (riff === "RIFF" && webp === "WEBP") {
        const chunk = buffer.toString("ascii", 12, 16);
        if (chunk === "VP8 " && buffer.length > 30) {
          const width = buffer.readUInt16LE(26) & 0x3fff;
          const height = buffer.readUInt16LE(28) & 0x3fff;
          if (width > 0 && height > 0) return { width, height };
        }
        if (chunk === "VP8L" && buffer.length > 25) {
          const bits = buffer.readUInt32LE(21);
          const width = (bits & 0x3fff) + 1;
          const height = ((bits >> 14) & 0x3fff) + 1;
          if (width > 0 && height > 0) return { width, height };
        }
      }
    }
  } catch {
    // Dimension detection is best-effort
  }
  return null;
}

export async function uploadMediaFile(file: File, altText?: string) {
  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error("Invalid file type. Allowed: JPG, PNG, WebP, AVIF, SVG.");
  }

  // 2. Validate extension
  const rawExtension = path.extname(file.name).toLowerCase();
  const extension = rawExtension || getExtensionFromMime(file.type);
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error("Invalid file extension. Allowed: .jpg, .jpeg, .png, .webp, .avif, .svg");
  }

  // 3. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Maximum size is 5MB.");
  }

  // 4. Convert File to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 5. Generate safe unique filename
  const randomHash = crypto.randomBytes(8).toString("hex");
  const sanitizedBase = file.name
    .toLowerCase()
    .replace(rawExtension, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  const fileName = `${sanitizedBase}-${randomHash}${extension}`;

  // 6. Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
  await fs.mkdir(uploadDir, { recursive: true });

  // 7. Write file to disk
  const targetPath = path.join(uploadDir, fileName);
  await fs.writeFile(targetPath, buffer);

  // 8. Detect image dimensions
  const dimensions = getImageDimensions(buffer, file.type.toLowerCase());

  // 9. Create database record
  const media = await prisma.cloudFile.create({
    data: {
      name: file.name,
      fileName,
      url: `/uploads/cms/${fileName}`,
      altText: altText || null,
      size: file.size,
      mimeType: file.type,
      width: dimensions?.width || null,
      height: dimensions?.height || null,
    },
  });

  return media;
}

export async function getMediaFiles(options: {
  search?: string;
  sort?: "newest" | "oldest" | "name";
  page?: number;
  limit?: number;
}) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 24;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { fileName: { contains: options.search, mode: "insensitive" } },
      { altText: { contains: options.search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (options.sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (options.sort === "name") {
    orderBy = { name: "asc" };
  }

  const [files, total] = await Promise.all([
    prisma.cloudFile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        fileName: true,
        url: true,
        altText: true,
        size: true,
        mimeType: true,
        width: true,
        height: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.cloudFile.count({ where }),
  ]);

  return {
    files,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getMediaFile(id: string) {
  return prisma.cloudFile.findUnique({
    where: { id },
  });
}

export async function updateMediaFile(id: string, data: { altText?: string; name?: string }) {
  const existing = await prisma.cloudFile.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Media file not found");
  }

  const updateData: any = {};
  if (data.altText !== undefined) updateData.altText = data.altText;
  if (data.name !== undefined) updateData.name = data.name;

  return prisma.cloudFile.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteMediaFile(id: string) {
  const existing = await prisma.cloudFile.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Media file not found");
  }

  // Delete file from disk if it exists
  if (existing.url && existing.url.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", existing.url);
      await fs.unlink(filePath);
    } catch {
      // File may already be missing from disk; continue with DB cleanup
    }
  }

  // Delete database record
  await prisma.cloudFile.delete({ where: { id } });

  return { deleted: true };
}
