import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function POST(req: Request, props: Props) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const payload = await verifyJwt(token);
        if (!payload || (payload.role !== "ADMIN" && payload.role !== "EMPLOYEE")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const params = await Promise.resolve(props.params);
        const { id } = params; // This is the chatSessionId
        
        // Find the ringing voice call for this session
        const call = await prisma.voiceCall.findFirst({
            where: {
                sessionId: id,
                status: "RINGING"
            }
        });

        if (!call) {
            return NextResponse.json({ success: false, message: "No ringing call found" }, { status: 404 });
        }
        
        const updatedCall = await prisma.voiceCall.update({
            where: { id: call.id },
            data: { status: "REJECTED", endedAt: new Date() }
        });

        await prisma.chatMessage.create({
            data: {
                sessionId: id,
                senderType: "SYSTEM",
                message: "Voice Call\nStatus: Declined"
            }
        });

        return NextResponse.json({ success: true, call: updatedCall });
    } catch (error) {
        console.error("Voice call reject error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
