import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getClientPayments } from "@/services/payment.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "CLIENT") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const payments = await getClientPayments(payload.id as string);
        return NextResponse.json({ success: true, payments }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
