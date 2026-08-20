
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const staleThreshold = new Date(Date.now() - 60000); // 60 seconds ago
        await prisma.voiceCall.updateMany({
            where: {
                status: "RINGING",
                createdAt: { lt: staleThreshold }
            },
            data: { status: "MISSED", endedAt: new Date() }
        });

        const chats = await prisma.chatSession.findMany({
            orderBy: { createdAt: 'desc' },
            include: { lead: true, voiceCalls: true }
        });
        return NextResponse.json({ success: true, chats });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
