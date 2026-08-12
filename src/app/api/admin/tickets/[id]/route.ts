import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getTicketDetails, updateTicketStatus } from "@/services/ticket.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { TicketStatus } from "@prisma/client";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const resolvedParams = await params;
        const ticket = await getTicketDetails(resolvedParams.id, payload.id as string, payload.role as string);
        
        return NextResponse.json({ success: true, ticket }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const resolvedParams = await params;
        const body = await req.json();
        const { status } = body;
        
        if (!status) {
            return NextResponse.json({ message: "Status is required" }, { status: 400 });
        }

        const updatedTicket = await updateTicketStatus(resolvedParams.id, status as TicketStatus);
        
        return NextResponse.json({ success: true, ticket: updatedTicket }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
