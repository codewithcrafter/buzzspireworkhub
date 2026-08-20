
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function POST(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { id } = params;
        const { message } = await req.json();
        
        const session = await prisma.chatSession.findUnique({ where: { id } });
        if (!session || session.status === "CLOSED") {
            return NextResponse.json({ success: false, message: "Closed" }, { status: 403 });
        }

        const newMessage = await prisma.chatMessage.create({
            data: {
                sessionId: id,
                senderType: "AGENT",
                message
            }
        });
        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
