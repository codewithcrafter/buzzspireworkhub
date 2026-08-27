import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getClientInvoices } from "@/services/invoice.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { id } = await params;
        const invoices = await getClientInvoices(id);
        
        return NextResponse.json({ success: true, invoices }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
