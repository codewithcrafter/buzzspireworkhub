import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getAdminInvoices, createInvoice } from "@/services/invoice.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const invoices = await getAdminInvoices();
        return NextResponse.json({ success: true, invoices }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const { clientId, amount, projectId, dueDate, invoiceNumber, service, description, subtotal, tax, discount, notes, paymentMethod, transactionId, paymentDate, status } = body;
        
        if (!clientId || amount === undefined) {
            return NextResponse.json({ message: "Client ID and amount are required" }, { status: 400 });
        }

        const newInvoice = await createInvoice({
            clientId,
            amount,
            projectId,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            invoiceNumber,
            service,
            description,
            subtotal,
            tax,
            discount,
            notes,
            paymentMethod,
            transactionId,
            paymentDate: paymentDate ? new Date(paymentDate) : undefined,
            status,
        });


        return NextResponse.json({ success: true, invoice: newInvoice }, { status: 201 });
    } catch (error: any) {
        console.error("ACTUAL PRISMA EXCEPTION:", error);
        const errorMessage = error?.message || "Unknown error occurred";
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}
