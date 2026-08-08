import { NextResponse } from "next/server";
import { getActiveWorkflows, createWorkflow } from "@/services/automation.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-response";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return ApiResponse.unauthorized();
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return ApiResponse.forbidden();

        const workflows = await getActiveWorkflows();
        return ApiResponse.success({ workflows });
    } catch (error) {
        return ApiResponse.serverError("Automations Error", error);
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return ApiResponse.unauthorized();
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return ApiResponse.forbidden();

        const body = await req.json();
        const newWorkflow = await createWorkflow(body.name, body.trigger, body.conditions);
        
        return ApiResponse.success({ workflow: newWorkflow }, 201);
    } catch (error) {
        return ApiResponse.serverError("Automations Error", error);
    }
}
