import { NextResponse } from "next/server";
import { generateInvoicePdf } from "@/lib/pdf-generator";

export async function GET() {
    try {
        const fakeInvoice = {
            id: "inv-123",
            createdAt: new Date(),
            dueDate: new Date(),
            status: "PAID",
            amount: 1000,
            subtotal: 1000,
            client: {
                name: "John Doe",
                company: "Doe Inc",
                email: "john@example.com"
            },
            payments: [
                {
                    method: "CARD",
                    transactionId: "TXN-999",
                    createdAt: new Date()
                }
            ]
        };
        const pdfBuffer = await generateInvoicePdf(fakeInvoice);

        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoice.pdf"`
            }
        });
    } catch (error: any) {
        console.error("PDF generation error TEST:", error);
        return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 });
    }
}
