import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        await limiter.check(20, ip); // Max 20 messages per minute per IP

        const { sessionId, message } = await req.json();

        if (!sessionId || !message) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });

        if (!session || session.status === "CLOSED") {
            return NextResponse.json({ success: false, message: "Session closed or not found" }, { status: 403 });
        }

        const newMessage = await prisma.chatMessage.create({
            data: {
                sessionId,
                senderType: "VISITOR",
                message
            }
        });

        return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
