import { NextResponse } from "next/server";
import { getLeads } from "@/services/lead.service";
import { verifyJwt } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const tokenCookie = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("token="));
        const token = tokenCookie ? tokenCookie.split("=")[1] : null;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await verifyJwt(token);
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const leads = await getLeads();
        return NextResponse.json({ success: true, leads }, { status: 200 });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
