import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

type Props = { params: Promise<{ callId: string }> | { callId: string } };

async function verifyAuth(req: Request, callId: string, body?: any) {
    const url = new URL(req.url);
    let visitorSessionId = url.searchParams.get("sessionId");
    
    if (!visitorSessionId && body?.sessionId) {
        visitorSessionId = body.sessionId;
    } else if (!visitorSessionId && !body && req.method === 'POST') {
        try {
            const clonedReq = req.clone();
            const json = await clonedReq.json();
            visitorSessionId = json.sessionId;
        } catch (e) {
            // ignore
        }
    }

    const call = await prisma.voiceCall.findUnique({
        where: { id: callId },
        include: { session: true }
    });

    if (!call) {
        return { authorized: false, call: null, senderType: null };
    }

    // Check if it's the visitor
    if (visitorSessionId && visitorSessionId === call.sessionId) {
        return { authorized: true, call, senderType: "VISITOR" };
    }

    // Check if it's an authenticated agent
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
        const payload = await verifyJwt(token);
        if (payload && (payload.role === "ADMIN" || payload.role === "EMPLOYEE")) {
            return { authorized: true, call, senderType: "AGENT" };
        }
    }

    return { authorized: false, call, senderType: null };
}

export async function GET(req: Request, props: Props) {
    let callId = "unknown";
    try {
        const params = await Promise.resolve(props.params);
        callId = params.callId;

        const { authorized, call } = await verifyAuth(req, callId);
        
        if (!authorized || !call) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Stale Call Protection (Timeout Logic)
        if (call.status === "RINGING") {
            const ringingDurationMs = Date.now() - call.createdAt.getTime();
            if (ringingDurationMs > 60000) { // 60 seconds
                await prisma.voiceCall.update({
                    where: { id: call.id },
                    data: { status: "MISSED", endedAt: new Date() }
                });
                call.status = "MISSED";
            }
        }

        const url = new URL(req.url);
        const since = url.searchParams.get("since"); // ISO string to get only new signals
        
        const whereClause: any = { callId };
        if (since) {
            whereClause.createdAt = { gt: new Date(since) };
        }

        const signals = await prisma.callSignal.findMany({
            where: whereClause,
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({ success: true, signals, status: call?.status });
    } catch (error: any) {
        console.error(`[WEBRTC][SIGNAL][SERVER] GET Error: callId=${callId} -`, error.message || error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, props: Props) {
    let callId = "unknown";
    let type = "unknown";
    let senderType = "unknown";
    try {
        const params = await Promise.resolve(props.params);
        callId = params.callId;
        const body = await req.json();

        type = body.type;
        const payload = body.payload;
        const authResult = await verifyAuth(req, callId, body);
        const authorized = authResult.authorized;
        senderType = authResult.senderType || "unknown";

        if (!authorized || senderType === "unknown") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (!type || payload === undefined || payload === null) {
            return NextResponse.json({ success: false, message: "Missing type or payload" }, { status: 400 });
        }

        const validTypes = ["offer", "answer", "candidate", "mute"];
        if (!validTypes.includes(type)) {
            return NextResponse.json({ success: false, message: "Invalid signal type" }, { status: 400 });
        }

        const signal = await prisma.callSignal.create({
            data: {
                callId,
                senderType: senderType as any,
                type,
                payload
            }
        });

        return NextResponse.json({ success: true, signal });
    } catch (error: any) {
        console.error(`[WEBRTC][SIGNAL][SERVER] POST Error: callId=${callId}, type=${type}, sender=${senderType} -`, error.message || error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
