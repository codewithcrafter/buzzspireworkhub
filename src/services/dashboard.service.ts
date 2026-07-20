import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    const [clients, leads, projects] = await Promise.all([
        prisma.user.count({
            where: {
                role: "CLIENT",
            },
        }),

        prisma.lead.count(),

        prisma.project.count(),
    ]);

    return {
        clients,
        leads,
        projects,
        revenue: 0,
    };
}