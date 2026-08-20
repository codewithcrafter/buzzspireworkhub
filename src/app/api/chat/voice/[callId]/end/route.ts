import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

type Props = { params: Promise<{ callId: string }> | { callId: string } };

export async function POST(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { callId } = params;
        
        const call = await prisma.voiceCall.findUnique({ where: { id: callId } });
        if (!call) return NextResponse.json({ success: false }, { status: 404 });

        let authorized = false;
        
        // Check visitor
        const body = await req.clone().json().catch(() => ({}));
        if (body.sessionId && body.sessionId === call.sessionId) {
            authorized = true;
        }

        // Check agent
        if (!authorized) {
            const cookieStore = await cookies();
            const token = cookieStore.get("token")?.value;
            if (token) {
                const payload = await verifyJwt(token);
                if (payload && (payload.role === "ADMIN" || payload.role === "EMPLOYEE")) {
                    authorized = true;
                }
            }
        }

        if (!authorized) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const endedAt = new Date();
        const durationSeconds = call.answeredAt ? Math.floor((endedAt.getTime() - call.answeredAt.getTime()) / 1000) : 0;
        const minutes = Math.floor(durationSeconds / 60).toString().padStart(2, '0');
        const seconds = (durationSeconds % 60).toString().padStart(2, '0');
        const durationStr = `${minutes}:${seconds}`;

        const updatedCall = await prisma.voiceCall.update({
            where: { id: callId },
            data: { status: "ENDED", endedAt }
        });

        await prisma.chatMessage.create({
            data: {
                sessionId: call.sessionId,
                senderType: "SYSTEM",
                message: `Voice Call\nStatus: Ended\nDuration: ${durationStr}`
            }
        });

        return NextResponse.json({ success: true, call: updatedCall });
    } catch (error) {
        console.error("End call error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
