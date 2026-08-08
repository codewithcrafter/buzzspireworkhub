import { prisma } from "@/lib/prisma";

export async function createLead(data: { name: string, email: string, company?: string, budget?: string, message: string }) {
    return prisma.lead.create({
        data
    });
}

export async function getLeads() {
    return prisma.lead.findMany({
        orderBy: { createdAt: "desc" }
    });
}
