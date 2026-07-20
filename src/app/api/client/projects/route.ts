import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { getClientProjects } from "@/services/project.service";

export async function GET() {
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

        if (!payload || payload.role !== "CLIENT") {
            return NextResponse.json(
                { error: "Forbidden: Access limited to clients" },
                { status: 403 }
            );
        }

        const clientId = payload.id as string;
        const projects = await getClientProjects(clientId);

        return NextResponse.json(
            {
                projects,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Client Projects GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
