import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function POST(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { id } = params;

        const session = await prisma.chatSession.findUnique({
            where: { id },
        });

        if (!session) {
            return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
        }

        await prisma.chatSession.update({
            where: { id },
            data: { status: "CLOSED" }
        });

        // Add a system message
        await prisma.chatMessage.create({
            data: {
                sessionId: id,
                senderType: "SYSTEM",
                message: "Chat ended by the visitor."
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error closing chat session:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
