import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getAdminPayments, createPayment, updatePaymentStatus } from "@/services/payment.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { PaymentStatus } from "@prisma/client";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const payments = await getAdminPayments();
        return NextResponse.json({ success: true, payments }, { status: 200 });
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
        const { invoiceId, amount, method } = body;
        
        if (!invoiceId || !amount) {
            return NextResponse.json({ message: "Invoice ID and amount are required" }, { status: 400 });
        }

        const newPayment = await createPayment(invoiceId, amount, method);
        return NextResponse.json({ success: true, payment: newPayment }, { status: 201 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const { paymentId, status } = body;
        
        if (!paymentId || !status) {
            return NextResponse.json({ message: "Payment ID and status are required" }, { status: 400 });
        }

        const updatedPayment = await updatePaymentStatus(paymentId, status as PaymentStatus);
        return NextResponse.json({ success: true, payment: updatedPayment }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
