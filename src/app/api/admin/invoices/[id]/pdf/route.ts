import { NextResponse } from "next/server";
import { getInvoiceById } from "@/services/invoice.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateInvoicePdf } from "@/lib/pdf-generator";

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
        const invoice = await getInvoiceById(id);
        
        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }

        const pdfBuffer = await generateInvoicePdf(invoice);

        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoice-${invoice.id.split('-')[0]}.pdf"`
            }
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
