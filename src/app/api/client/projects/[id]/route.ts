import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { getClientProjectDetails, sendProjectMessage } from "@/services/project.service";
import { prisma } from "@/lib/prisma";

// GET: Securely retrieve client project details, respecting visibility flags
export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
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
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const projectId = params.id;
        const clientId = payload.id as string;

        const projectDetails = await getClientProjectDetails(projectId, clientId);

        return NextResponse.json(
            {
                project: projectDetails,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Client Project Details GET Error:", error);
        
        if (error instanceof Error && error.message.includes("Access denied")) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: Send direct message to admin regarding a project
export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
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
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const projectId = params.id;
        const clientId = payload.id as string;
        const { text } = await req.json();

        if (!text || text.trim() === "") {
            return NextResponse.json(
                { error: "Message text is required" },
                { status: 400 }
            );
        }

        // Fetch project and verify showMessages toggle is enabled
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                clientId,
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        if (!project.showMessages) {
            return NextResponse.json(
                { error: "Direct messaging is disabled for this project" },
                { status: 400 }
            );
        }

        // Resolve ADMIN user ID to set as recipient
        const adminUser = await prisma.user.findFirst({
            where: {
                role: "ADMIN",
            },
            select: {
                id: true,
            },
        });

        if (!adminUser) {
            return NextResponse.json(
                { error: "Admin user not found" },
                { status: 404 }
            );
        }

        const message = await sendProjectMessage(
            projectId,
            clientId,      // senderId
            adminUser.id,  // recipientId
            text.trim()
        );

        return NextResponse.json(
            {
                message,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Client Send Message Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
