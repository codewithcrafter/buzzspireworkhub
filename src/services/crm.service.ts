import { prisma } from "@/lib/prisma";

export async function createProspect(name: string, email: string, company?: string) {
    return prisma.prospect.create({
        data: { name, email, company }
    });
}

export async function getProspects() {
    return prisma.prospect.findMany({
        orderBy: { score: 'desc' },
        include: { meetings: true, calls: true }
    });
}

export async function logCall(prospectId: string, duration: number, outcome: string) {
    return prisma.callLog.create({
        data: { prospectId, duration, outcome }
    });
}

export async function scheduleMeeting(prospectId: string, date: Date, notes?: string) {
    return prisma.meeting.create({
        data: { prospectId, date, notes }
    });
}
