import { NextResponse } from "next/server";
import { getProspects, createProspect } from "@/services/crm.service";
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

        const prospects = await getProspects();
        return ApiResponse.success({ prospects });
    } catch (error) {
        return ApiResponse.serverError("CRM Error", error);
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
        const newProspect = await createProspect(body.name, body.email, body.company);
        
        return ApiResponse.success({ prospect: newProspect }, 201);
    } catch (error) {
        return ApiResponse.serverError("CRM Error", error);
    }
}
