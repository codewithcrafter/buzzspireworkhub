import { prisma } from "@/lib/prisma";

export async function createAuthor(data: {
  name: string;
  photoUrl?: string;
  designation?: string;
  bio?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}) {
  return prisma.author.create({
    data: {
      name: data.name,
      photoUrl: data.photoUrl || null,
      designation: data.designation || null,
      bio: data.bio || null,
      facebookUrl: data.facebookUrl || null,
      instagramUrl: data.instagramUrl || null,
      linkedinUrl: data.linkedinUrl || null,
    },
  });
}

export async function updateAuthor(
  id: string,
  data: Partial<{
    name: string;
    photoUrl: string | null;
    designation: string | null;
    bio: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    linkedinUrl: string | null;
  }>
) {
  return prisma.author.update({
    where: { id },
    data,
  });
}

export async function getAuthor(id: string) {
  return prisma.author.findUnique({
    where: { id },
  });
}

export async function getAuthors() {
  return prisma.author.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteAuthor(id: string) {
  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      _count: {
        select: { blogs: true },
      },
    },
  });

  if (!author) {
    throw new Error("Author not found");
  }

  if (author._count.blogs > 0) {
    throw new Error("Cannot delete author. They are assigned to existing blogs. Please reassign those blogs first.");
  }

  return prisma.author.delete({
    where: { id },
  });
}
