import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { createClientWithPassword } from "@/services/user.service";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyJwt(token);

        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { 
            name, email, company, phone, service, password,
            totalBudget, initialPaidAmount, projectName, 
            projectStartDate, expectedCompletionDate, 
            projectStatus, completionPercentage 
        } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required fields" },
                { status: 400 }
            );
        }

        const result = await createClientWithPassword(
            name, email, password, company || "", phone || "", service || "",
            Number(totalBudget) || 0,
            Number(initialPaidAmount) || 0,
            projectName || "",
            projectStartDate || "",
            expectedCompletionDate || "",
            projectStatus || "PLANNING",
            Number(completionPercentage) || 0
        );
        const { user, emailSent, emailError } = result;

        return NextResponse.json(
            {
                message: emailSent 
                    ? "Client created successfully and welcome email sent" 
                    : `Client created, but the welcome email could not be sent. Reason: ${emailError}`,
                client: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    phone: user.phone,
                },
                emailSent,
                emailError
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
