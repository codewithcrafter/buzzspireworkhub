import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getAdminProjects, createProject } from "@/services/project.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const projects = await getAdminProjects();
        return NextResponse.json({ success: true, projects }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const newProject = await createProject(body);
        
        return NextResponse.json({ success: true, project: newProject }, { status: 201 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
