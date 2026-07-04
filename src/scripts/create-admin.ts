import "dotenv/config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Missing");
    console.log("URL:", process.env.DATABASE_URL);
    const email = "admin@buzzspiremedia.com";
    const password = "Admin@123";

    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        console.log("Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name: "Buzzspire Admin",
            email,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Admin created successfully!");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });