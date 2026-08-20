import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ success: false, message: "Missing sessionId" }, { status: 400 });
        }

        // Verify the session exists
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: { voiceCalls: true }
        });

        if (!session) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 404 });
        }

        // Don't create duplicate ringing/active calls
        const activeCall = session.voiceCalls.find(call => call.status === "RINGING" || call.status === "ACTIVE");
        if (activeCall) {
            return NextResponse.json({ success: true, call: activeCall });
        }

        // Create new voice call
        const newCall = await prisma.voiceCall.create({
            data: {
                sessionId,
                status: "RINGING",
            }
        });

        return NextResponse.json({ success: true, call: newCall });
    } catch (error) {
        console.error("Voice call init error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
