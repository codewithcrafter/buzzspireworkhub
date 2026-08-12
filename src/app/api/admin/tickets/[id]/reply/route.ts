import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { addTicketReply } from "@/services/ticket.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const resolvedParams = await params;
        const body = await req.json();
        const { text } = body;
        
        if (!text) {
            return NextResponse.json({ message: "Reply text is required" }, { status: 400 });
        }

        const reply = await addTicketReply(resolvedParams.id, payload.id as string, text);
        
        return NextResponse.json({ success: true, reply }, { status: 201 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
