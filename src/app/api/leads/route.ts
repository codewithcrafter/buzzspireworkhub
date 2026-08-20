import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { createLead } from "@/services/lead.service";
import { sendLeadConfirmationEmail, sendLeadNotificationEmail } from "@/services/email.service";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

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

        if (source === "Website Chatbot") {
            let chatSessionId: string | undefined;

            try {
                // Create a Chat Session for the visitor
                const chatSession = await prisma.chatSession.create({
                    data: {
                        leadId: newLead.id,
                        status: "WAITING",
                        visitorName: name,
                        visitorEmail: email,
                        visitorPhone: phone || null,
                        service: service || null
                    }
                });
                chatSessionId = chatSession.id;
            } catch (error) {
                console.error("Failed to create ChatSession:", error);
            }

            try {
                await Promise.all([
                    sendLeadConfirmationEmail(newLead),
                    sendLeadNotificationEmail(newLead)
                ]);
            } catch (emailError) {
                console.error("Failed to send chatbot emails:", emailError);
                // Do NOT fail the response, lead was already created
            }

            return NextResponse.json({ 
                success: true, 
                ...newLead, 
                ...(chatSessionId && { chatSessionId }) 
            }, { status: 201 });
        }

        return NextResponse.json({ success: true, ...newLead }, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
