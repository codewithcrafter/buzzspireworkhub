import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";
import { getAdminProjectDetails, updateProjectVisibility, updateProjectProgress, deleteProject } from "@/services/project.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const resolvedParams = await params;
        const project = await getAdminProjectDetails(resolvedParams.id);
        if (!project) return NextResponse.json({ message: "Not Found" }, { status: 404 });
        
        return NextResponse.json({ success: true, project }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const resolvedParams = await params;
        const body = await req.json();
        
        if (body.progress !== undefined) {
             await updateProjectProgress(resolvedParams.id, body.progress, body.progressStages);
        } else {
             await updateProjectVisibility(resolvedParams.id, body);
        }
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const resolvedParams = await params;
        await deleteProject(resolvedParams.id);
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return ApiResponse.serverError("API Execution Error", error);
    }
}
