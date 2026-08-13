import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { createLead } from "@/services/lead.service";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        await limiter.check(5, ip); // Max 5 lead submissions per minute per IP
        
        const body = await req.json();
        const { name, email, company, budget, service, message, source, pageUrl, portfolio, phone } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newLead = await createLead({
            name,
            email,
            company,
            budget,
            service,
            message,
            source,
            pageUrl,
            portfolio,
            phone
        });

        return NextResponse.json({ success: true, ...newLead }, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
