import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/dashboard.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyJwt(token);

        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const stats = await getDashboardStats();

        return NextResponse.json(
            {
                success: true,
                stats,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Dashboard API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
