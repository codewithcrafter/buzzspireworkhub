import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";

/**
 * GET /api/auth/session
 * Returns the currently authenticated user's id, name, email, role, and permissions.
 * Works for both admin (token cookie) and employee (employee_token cookie) sessions.
 */
export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.authenticated) return auth.response;

    const { id, name, email, role, employeeId, employeeCode } = auth.user;

    return NextResponse.json({ user: { id, name, email, role, employeeId, employeeCode } }, { status: 200 });
  } catch (error) {
    console.error("Session route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
