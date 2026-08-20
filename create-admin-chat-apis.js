const fs = require('fs');
const path = require('path');

const mkdirp = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// 1. /api/admin/chats/route.ts
const adminChatsDir = path.join(__dirname, 'src/app/api/admin/chats');
mkdirp(adminChatsDir);
fs.writeFileSync(path.join(adminChatsDir, 'route.ts'), `
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const chats = await prisma.chatSession.findMany({
            orderBy: { createdAt: 'desc' },
            include: { lead: true }
        });
        return NextResponse.json({ success: true, chats });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
`);

// 2. /api/admin/chats/[id]/route.ts
const adminChatIdDir = path.join(adminChatsDir, '[id]');
mkdirp(adminChatIdDir);
fs.writeFileSync(path.join(adminChatIdDir, 'route.ts'), `
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function GET(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { id } = params;
        const session = await prisma.chatSession.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } }, lead: true }
        });
        if (!session) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, session });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
`);

// 3. /api/admin/chats/[id]/messages/route.ts
const adminChatMessagesDir = path.join(adminChatIdDir, 'messages');
mkdirp(adminChatMessagesDir);
fs.writeFileSync(path.join(adminChatMessagesDir, 'route.ts'), `
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
`);

// 4. /api/admin/chats/[id]/accept/route.ts
const adminChatAcceptDir = path.join(adminChatIdDir, 'accept');
mkdirp(adminChatAcceptDir);
fs.writeFileSync(path.join(adminChatAcceptDir, 'route.ts'), `
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
`);

// 5. /api/admin/chats/[id]/close/route.ts
const adminChatCloseDir = path.join(adminChatIdDir, 'close');
mkdirp(adminChatCloseDir);
fs.writeFileSync(path.join(adminChatCloseDir, 'route.ts'), `
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> | { id: string } };

export async function POST(req: Request, props: Props) {
    try {
        const params = await Promise.resolve(props.params);
        const { id } = params;
        
        const session = await prisma.chatSession.update({
            where: { id },
            data: { status: "CLOSED" }
        });
        
        return NextResponse.json({ success: true, session });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
`);
console.log("Admin API routes created.");
