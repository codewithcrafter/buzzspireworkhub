import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { updateInvoice, deleteInvoice } from "@/services/invoice.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { id } = await params;
        const body = await req.json();

        // Convert dueDate if present
        if (body.dueDate) {
            body.dueDate = new Date(body.dueDate);
        }
        if (body.paymentDate) {
            body.paymentDate = new Date(body.paymentDate);
        }

        const { prisma } = await import("@/lib/prisma");
        const existingInvoice = await prisma.invoice.findUnique({ where: { id } });

        const updated = await updateInvoice(id, body);


        return NextResponse.json({ success: true, invoice: updated }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { id } = await params;
        
        await deleteInvoice(id);
        return NextResponse.json({ success: true, message: "Invoice deleted successfully" }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
