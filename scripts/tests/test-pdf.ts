import { generateInvoicePdf } from "./src/lib/pdf-generator";

async function run() {
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
        const buffer = await generateInvoicePdf(fakeInvoice);
        console.log("PDF generated, size:", buffer.length);
    } catch (error) {
        console.error("PDF generation failed:", error);
    }
}

run();
