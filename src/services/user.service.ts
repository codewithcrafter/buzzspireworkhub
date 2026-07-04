import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createClient(
    name: string,
    email: string,
    password: string
) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "CLIENT",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
}