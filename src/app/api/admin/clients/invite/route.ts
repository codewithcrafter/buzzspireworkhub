import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { inviteClient } from "@/services/user.service";

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

        const { name, email, company, phone } = await req.json();

        if (!name || !email || !company || !phone) {
            return NextResponse.json(
                { error: "Name, email, company, and phone are all required fields" },
                { status: 400 }
            );
        }

        const client = await inviteClient(name, email, company, phone);

        return NextResponse.json(
            {
                message: "Client invited successfully",
                client: {
                    id: client.id,
                    name: client.name,
                    email: client.email,
                    company: client.company,
                    phone: client.phone,
                },
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
