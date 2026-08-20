
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function GET(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { id } = params;
        const session = await prisma.chatSession.findUnique({
            where: { id },
            include: { 
                messages: { orderBy: { createdAt: 'asc' } }, 
                lead: true,
                voiceCalls: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!session) return NextResponse.json({ success: false }, { status: 404 });

        if (session.voiceCalls && session.voiceCalls.length > 0) {
            const latestCall = session.voiceCalls[0];
            if (latestCall.status === "RINGING") {
                const ringingDurationMs = Date.now() - latestCall.createdAt.getTime();
                if (ringingDurationMs > 60000) { // 60 seconds
                    await prisma.voiceCall.update({
                        where: { id: latestCall.id },
                        data: { status: "MISSED", endedAt: new Date() }
                    });
                    latestCall.status = "MISSED";
                }
            }
        }

        return NextResponse.json({ success: true, session });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
