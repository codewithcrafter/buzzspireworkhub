import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acceptInvitation } from "@/services/user.service";

// GET: Verify that an invitation token is valid and not expired
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        // Find user with active token
        const user = await prisma.user.findUnique({
            where: {
                invitationToken: token,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired invitation link" },
                { status: 400 }
            );
        }

        // Verify token expiration
        if (user.invitationExpires && new Date() > user.invitationExpires) {
            return NextResponse.json(
                { error: "Invitation link has expired" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                name: user.name,
                email: user.email,
                company: user.company,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: Accept invitation and save client password
export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const user = await acceptInvitation(token, password);

        return NextResponse.json(
            {
                message: "Password setup successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
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
