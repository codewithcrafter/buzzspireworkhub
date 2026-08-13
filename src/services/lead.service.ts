import { prisma } from "@/lib/prisma";

export async function createLead(data: {
    name: string;
    email: string;
    company?: string;
    budget?: string;
    service?: string;
    message: string;
    source?: string;
    pageUrl?: string;
    portfolio?: string;
    phone?: string;
}) {
    return prisma.lead.create({
        data
    });
}

export async function getLeads() {
    return prisma.lead.findMany({
        orderBy: { createdAt: "desc" }
    });
}
