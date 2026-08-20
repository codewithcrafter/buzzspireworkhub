
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function POST(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { id } = params;
        
        const session = await prisma.chatSession.update({
            where: { id },
            data: { status: "ACTIVE" }
        });

        await prisma.chatMessage.create({
            data: {
                sessionId: id,
                senderType: "SYSTEM",
                message: "You are now connected with a BuzzSpire agent."
            }
        });
        
        return NextResponse.json({ success: true, session });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
