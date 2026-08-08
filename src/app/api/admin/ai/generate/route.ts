import { NextResponse } from "next/server";
import { generateContent, logAiUsage } from "@/services/ai.service";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return ApiResponse.unauthorized();
        
        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") return ApiResponse.forbidden();

        const { prompt, action } = await req.json();
        
        if (!prompt || !action) {
            return ApiResponse.badRequest("Prompt and action are required");
        }

        const { response, tokens } = await generateContent(prompt);
        await logAiUsage(payload.id as string, action, tokens, prompt, response);

        return ApiResponse.success({ response, tokens }, 201);
    } catch (error) {
        return ApiResponse.serverError("AI Generation Error", error);
    }
}
